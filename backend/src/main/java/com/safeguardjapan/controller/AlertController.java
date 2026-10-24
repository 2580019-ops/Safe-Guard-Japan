package com.safeguardjapan.controller;

import com.safeguardjapan.model.AlertInfo;
import com.safeguardjapan.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /**
     * REST API for live/cached disaster information
     */
    @GetMapping("/api/alert")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getAlertApi(
            @RequestParam(name = "language", defaultValue = "ja") String language) {
        AlertInfo alert = alertService.getDisasterAlert(language);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("language", alertService.normalizeLanguage(language));
        response.put("data", alert);

        return ResponseEntity.ok(response);
    }

    /**
     * Detailed alert view page
     */
    @GetMapping("/alert-info")
    public String alertInfoPage(
            @RequestParam(name = "lang", defaultValue = "ja") String lang,
            Model model) {
        model.addAttribute("currentLang", alertService.normalizeLanguage(lang));
        model.addAttribute("alert", alertService.getDisasterAlert(lang));
        return "alert-info";
    }
}
