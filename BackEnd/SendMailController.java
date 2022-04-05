package com.twyk.myWebApplication.controller;

import com.twyk.myWebApplication.controller.bean.SendMailDTO;
import com.twyk.myWebApplication.repository.AppPasswordRepository;
import com.twyk.myWebApplication.util.GMailUtil;
import org.springframework.web.bind.annotation.*;

@RestController()
@CrossOrigin(origins = {"https://www.tw-yk.website","https://tw-yk.website","http://localhost:45678"})
@RequestMapping("")
public class SendMailController {
    private final AppPasswordRepository appPasswordRepository;

    public SendMailController(AppPasswordRepository appPasswordRepository) {
        this.appPasswordRepository = appPasswordRepository;
    }

    @PostMapping("/sendMail/1")
    public int sendMain1(@RequestBody SendMailDTO sendMailDTO) {
        // Mark the section we want to replace
        String replaceTimeAndDate = "*****TimeAndDate*****";
        String place = "心理系南館3樓314室門口";

        // Set up all variables we need
        String from = sendMailDTO.getFrom().split("@")[0];
        String subject = sendMailDTO.getSubject();
        String to = sendMailDTO.getTo();
        String date = sendMailDTO.getDate();
        String body = sendMailDTO.getBody();

        // For replacing
        String[] dateInfo = date.split(" ");
        String weekDay = dateInfo[1];
        String dayTime = dateInfo[2].split(":")[0];

        // Manipulate the mail content
        String[] bodyArr = body.split("\n");
        StringBuilder sb = new StringBuilder();
        for(String s:bodyArr) {
            // Replace the place by the date and time
            if(!weekDay.contains("六") && !weekDay.contains("日") && Integer.valueOf(dayTime) < 17 && s.contains("心理系北館大門口"))
                s = s.replace("心理系北館大門口", place);

            if(s.contains(replaceTimeAndDate))
                s = s.replace(replaceTimeAndDate, date);

            if(s.contains("<red>")) {
                sb.append("<span style=\"display:inline-block; color:red\">" + s.replaceAll("<red>", "") + "</span>");
            } else {
                sb.append("<div style=\"margin-top:1em\">" + s + "</div>");
            }
        }

        String pass = appPasswordRepository.getById(from).getAppPassword();

        if(GMailUtil.sendFromGMail(from, pass, subject, to, sb.toString()))
            return 1;

        else
            return 0;
    }

    @PostMapping("sendMail/2")
    public int sendMail2(@RequestBody SendMailDTO sendMailDTO) {
        String replaceName = "*****Name*****";
        String replaceTime = "*****Time*****";
        String replaceDate = "*****Date*****";
        String replaceWeek = "*****Week*****";
        String place = "心理系南館3樓314室門口";

        // Set up all variables we need
        String from = sendMailDTO.getFrom().split("@")[0];
        String subject = sendMailDTO.getSubject();
        String to = sendMailDTO.getTo();
        String date = sendMailDTO.getDate();
        String name = sendMailDTO.getName();
        String body = sendMailDTO.getBody();

        // For replacing
        String[] dateInfo = date.split(" ");
        String weekDay = dateInfo[1];
        String dayTime = dateInfo[2].split(":")[0];

        // Manipulate the mail content
        String[] bodyArr = body.split("\n");
        StringBuilder sb = new StringBuilder();

        for(String s:bodyArr) {
            // Replace the place by the date and time
            if(!weekDay.contains("六") && !weekDay.contains("日") && Integer.valueOf(dayTime) < 17 && s.contains("心理系北館大門口"))
                s = s.replace("心理系北館大門口", place);

            if(s.contains(replaceDate))
                s = s.replace(replaceDate, date.split(" ")[0]);

            if(s.contains(replaceWeek))
                s = s.replace(replaceWeek, weekDay.replace("(","").replace(")",""));

            if(s.contains(replaceTime))
                s = s.replace(replaceTime, dateInfo[2]);

            if(s.contains(replaceName))
                s = s.replace(replaceName, name);

            if(s.contains("<ul>")) {
                sb.append("<ul>");
                String[] liArr = s.replace("<ul>","").split("<li>");
                for(String liString:liArr) {
                    if(liString.contains("<red>") && liString.contains("<i><strong>")) {
                        String[] focusP = liString.replaceAll("<red>", "").split("<i><strong>");
                        sb.append("<li style =\"color:red\">" + focusP[0]);
                        sb.append("<i>" + "<strong>" + focusP[1] + "</i>" + "</strong>");
                        sb.append(focusP[2] + "</li>");
                    }

                    else
                        sb.append("<li>" + liString + "</li>");
                }

                sb.append("</ul>");
            }

            else if(s.contains("<red>")) {
                sb.append("<span style=\"display:inline-block; color:red\">" + s.replaceAll("<red>", "") + "</span>");
            } else {
                sb.append("<div>" + s + "</div>");
            }
        }

        String pass = appPasswordRepository.getById(from).getAppPassword();

        if(GMailUtil.sendFromGMail(from, pass, subject, to, sb.toString()))
            return 1;

        else
            return 0;
    }
}