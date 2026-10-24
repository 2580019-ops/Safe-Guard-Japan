package com.safeguardjapan.controller;

import com.safeguardjapan.model.Shelter;
import com.safeguardjapan.model.ShelterSearchForm;
import com.safeguardjapan.service.ShelterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    /**
     * REST API: GET /api/shelters
     * Validates latitude (-90 to 90), longitude (-180 to 180), radius (1 to 20 km), disasterType
     */
    @GetMapping("/api/shelters")
    @ResponseBody
    public ResponseEntity<?> getNearbySheltersApi(
            @Valid @ModelAttribute ShelterSearchForm form,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Validation failed for shelter search parameters.");
            errorResponse.put("errors", bindingResult.getAllErrors().stream()
                    .map(e -> e.getDefaultMessage())
                    .toList());
            return ResponseEntity.badRequest().body(errorResponse);
        }

        List<Shelter> results = shelterService.searchNearbyShelters(form);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("count", results.size());
        response.put("isSampleData", true);
        response.put("dataNotice", "Sample shelter records for demonstration. Verify actual locations with municipal authorities.");
        response.put("data", results);

        return ResponseEntity.ok(response);
    }

    /**
     * Web page: GET /shelters (Interactive Map & Search)
     */
    @GetMapping("/shelters")
    public String sheltersPage(
            @RequestParam(name = "lang", defaultValue = "ja") String lang,
            Model model) {
        model.addAttribute("currentLang", lang);
        return "shelters";
    }
}
