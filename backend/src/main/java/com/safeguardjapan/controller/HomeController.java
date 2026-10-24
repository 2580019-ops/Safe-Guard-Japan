package com.safeguardjapan.controller;

import com.safeguardjapan.service.AlertService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

    private final AlertService alertService;

    public HomeController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/")
    public String index(@RequestParam(name = "lang", defaultValue = "ja") String lang, Model model) {
        model.addAttribute("currentLang", alertService.normalizeLanguage(lang));
        model.addAttribute("alert", alertService.getDisasterAlert(lang));
        return "index";
    }
}
