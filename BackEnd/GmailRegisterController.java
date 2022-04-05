package com.twyk.myWebApplication.controller;

import com.twyk.myWebApplication.database.bean.AppPassword;
import com.twyk.myWebApplication.repository.AppPasswordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"https://www.tw-yk.website","https://tw-yk.website","http://localhost:45678"})
@RequestMapping("")
public class GmailRegisterController {
    private final AppPasswordRepository appPasswordRepository;

    public GmailRegisterController(AppPasswordRepository appPasswordRepository) {
        this.appPasswordRepository = appPasswordRepository;
    }

    @PostMapping("/gmailRegister")
    public ResponseEntity gmailRegister(@RequestParam String gmail, @RequestParam String appPassword) {
        gmail = gmail.split("@")[0];
        AppPassword info = new AppPassword(gmail, appPassword);
        appPasswordRepository.save(info);
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/gmailCheck")
    public boolean gamilCheck(@RequestParam String gmail) {
        return appPasswordRepository.existsById(gmail.split("@")[0]);
    }
}
