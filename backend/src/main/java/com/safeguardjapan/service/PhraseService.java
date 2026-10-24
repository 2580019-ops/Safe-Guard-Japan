package com.safeguardjapan.service;

import com.safeguardjapan.mapper.PhraseMapper;
import com.safeguardjapan.model.Phrase;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhraseService {

    private final PhraseMapper phraseMapper;

    public PhraseService(PhraseMapper phraseMapper) {
        this.phraseMapper = phraseMapper;
    }

    public List<Phrase> getPhrasesByCategory(String category) {
        return phraseMapper.findByCategory(category);
    }

    public List<Phrase> getAllPhrases() {
        return phraseMapper.findAll();
    }

    public Phrase getPhraseByKey(String category, String keyFragment) {
        List<Phrase> list = phraseMapper.findByCategory(category);
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }
}
