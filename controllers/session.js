const {OnlineSession } = require("../models/onlineSession");
const mongoose = require('mongoose');
const _ = require('lodash')
const { Service} = require('../models/service');
const { Student } = require('../models/student');
const axios = require('axios')
const zoomJwt = require('../utils/zoomToken')
require('dotenv').config()

exports.submitOnlineSession = async (req, res) => {
    let student = await Student.findById(req.body.student)
    if (!student) return res.status(404).send('cannot find a student with the given id')
    let service = await Service.findById(req.body.service).populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    console.log(service)
    if (!service) return res.status(404).send('cannot find a service with the given id')
    let onlineSession = new OnlineSession({
        day: req.body.day,
        month: req.body.month,
        hour: req.body.hour,
        sessionDuration: req.body.sessionDuration/60,
        studentsNum: req.body.studentsNum,
        tutor: req.user._id,
        service: req.body.service,
        student: req.body.student
    })
    let sessionTopic= `${service.subject.subject} for ${service.level.level} online session` 
    let sessionTime = `${new Date().getFullYear()}-${req.body.month}-${req.body.day}T${req.body.hour}:00:00`
    let zoomLink=await requestZoomLink(sessionTopic, req.body.sessionDuration, sessionTime)
    onlineSession.zoomMeeting= zoomLink
    onlineSession.sessionTitle=sessionTopic
    await onlineSession.save()
    return res.send(onlineSession)
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