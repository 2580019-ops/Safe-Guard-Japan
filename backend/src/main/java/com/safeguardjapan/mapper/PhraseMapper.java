package com.safeguardjapan.mapper;

import com.safeguardjapan.model.Phrase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface PhraseMapper {

    @Select("SELECT id, category, text_ja, text_en, text_bn, text_vi, sort_order " +
            "FROM phrases WHERE category = #{category} ORDER BY sort_order ASC")
    List<Phrase> findByCategory(@Param("category") String category);

    @Select("SELECT id, category, text_ja, text_en, text_bn, text_vi, sort_order " +
            "FROM phrases ORDER BY category, sort_order ASC")
    List<Phrase> findAll();
}
