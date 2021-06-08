const { OnlineSession } = require("../models/onlineSession");
const mongoose = require('mongoose');
const _ = require('lodash')
const { Service, Subject, Level, SystemLanguage } = require('../models/service');
const { Student } = require('../models/student');
const axios = require('axios')
const zoomJwt = require('../utils/zoomToken');
const { OfflineSession } = require("../models/offlineSession");
require('dotenv').config()

exports.submitOnlineSession = async (req, res) => {
    let student = await Student.findById(req.body.student)
    if (!student) return res.status(404).send('cannot find a student with the given id')
    let service = await Service.findById(req.body.service).populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    if (!service) return res.status(404).send('cannot find a service with the given id')
    let onlineSession = new OnlineSession({
        day: req.body.day,
        month: req.body.month,
        hour: req.body.hour,
        sessionDuration: req.body.sessionDuration / 60,
        studentsNum: req.body.studentsNum,
        tutor: req.user._id,
        service: req.body.service,
        student: req.body.student,
        minute: req.body.minute
    })
    let sessionTopic = `${service.subject.subject} for ${service.level.level} online session`
    let sessionTime = `${new Date().getFullYear()}-${req.body.month}-${req.body.day}T${req.body.hour-2}:${req.body.minute}:00`
    let zoomLink = await requestZoomLink(sessionTopic, req.body.sessionDuration, sessionTime)
    onlineSession.zoomMeeting = zoomLink
    onlineSession.sessionTitle = sessionTopic
    await onlineSession.save()
    return res.send(onlineSession)
}

exports.submitOfflineSession = async (req, res) => {
    let student = await Student.findById(req.body.student)
    if (!student) return res.status(404).send("no student with the given ID")
    let service = await Service.findById(req.body.service).populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    if (!service) return res.status(404).send('cannot find a service with the given id')
    let offlineSession = new OfflineSession({
        day: req.body.day,
        month: req.body.month,
        hour: req.body.hour,
        sessionDuration: req.body.sessionDuration / 60,
        studentsNum: req.body.studentsNum,
        tutor: req.user._id,
        service: req.body.service,
        student: req.body.student,
        location: req.body.location,
        minute: req.body.minute

    })
    let sessionTopic = `${service.subject.subject} for ${service.level.level} offline session`
    offlineSession.sessionTitle = sessionTopic
    await offlineSession.save()
    return res.send(offlineSession)
}

exports.getSessions = async (req, res) => {
    let response = {}
    if (req.user.role == 'tutor') {
        response.onlineSessions = await OnlineSession.find({ tutor: req.user._id }).sort({ _id: -1 })
            .populate('student', '-password -__v -isVerified -confirmationToken')
            .populate({
                path: 'service', populate: {
                    path: 'subject',
                    model: Subject
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'level',
                    model: Level
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'systemLanguage',
                    model: SystemLanguage
                }
            })
        response.offlineSessions = await OfflineSession.find({ tutor: req.user._id }).sort({ _id: -1 })
            .populate('student', '-password -__v -isVerified -confirmationToken')
            .populate({
                path: 'service', populate: {
                    path: 'subject',
                    model: Subject
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'level',
                    model: Level
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'systemLanguage',
                    model: SystemLanguage
                }
            })
            
    }
    else if (req.user.role == 'student') {
        response.onlineSessions = await OnlineSession.find({ student: req.user._id }).sort({ _id: -1 })
            .populate('tutor', '-password -__v')
            .populate({
                path: 'service', populate: {
                    path: 'subject',
                    model: Subject
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'level',
                    model: Level
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'systemLanguage',
                    model: SystemLanguage
                }
            })
        response.offlineSessions = await OfflineSession.find({ student: req.user._id }).sort({ _id: -1 })
            .populate('tutor', '-password -__v')
            .populate({
                path: 'service', populate: {
                    path: 'subject',
                    model: Subject
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'level',
                    model: Level
                }
            })
            .populate({
                path: 'service', populate: {
                    path: 'systemLanguage',
                    model: SystemLanguage
                }
            })

    }
    return res.send(response)
}

async function requestZoomLink(sessionName, duration, sessionTime) {
    let token = zoomJwt()
    console.log(token)
    try {
        const response = await axios.post(`https://api.zoom.us/v2/users/${process.env.ZOOM_HOST_EMAIL}/meetings`, {
            "topic": `${sessionName}`,
            "type": 2,
            "start_time": sessionTime,
            "timezone": "UTC",
            "duration": duration,
            "settings": {
                "join_before_host": true
            }
        },
            {
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        console.log(response.data)
        return response.data.join_url
    }
    catch (err) {
        console.log(err.message)
    }
}