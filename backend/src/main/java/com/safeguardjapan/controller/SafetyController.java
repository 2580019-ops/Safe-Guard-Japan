package com.safeguardjapan.controller;

import com.safeguardjapan.service.AlertService;
import com.safeguardjapan.service.PhraseService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SafetyController {

    private final PhraseService phraseService;
    private final AlertService alertService;

    public SafetyController(PhraseService phraseService, AlertService alertService) {
        this.phraseService = phraseService;
        this.alertService = alertService;
    }

    /**
     * Safety Confirmation Generator page
     * Client-side only transmission via Web Share API or clipboard.
     * No backend storage or tracking of personal location or notes.
     */
    @GetMapping("/safety-status")
    public String safetyStatusPage(
            @RequestParam(name = "lang", defaultValue = "ja") String lang,
            Model model) {
        String safeLang = alertService.normalizeLanguage(lang);
        model.addAttribute("currentLang", safeLang);
        model.addAttribute("safetyPhrases", phraseService.getPhrasesByCategory("safety_status"));
        return "safety-status";
    }

    /**
     * Sharing Feedback / Completion Page
     */
    @GetMapping("/safety-status/sent")
    public String safetyStatusSentPage(
            @RequestParam(name = "lang", defaultValue = "ja") String lang,
            Model model) {
        String safeLang = alertService.normalizeLanguage(lang);
        model.addAttribute("currentLang", safeLang);
        return "safety-sent";
    }
}
