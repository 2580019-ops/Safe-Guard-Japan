package com.safeguardjapan.mapper;

import com.safeguardjapan.model.Shelter;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ShelterMapper {

    /**
     * Parameterized read-only candidate query.
     * Prevents SQL injection via MyBatis #{} bindings.
     */
    @Select("<script>" +
            "SELECT id, name_ja, name_en, address, latitude, longitude, " +
            "is_earthquake, is_tsunami, is_flood, capacity " +
            "FROM shelters " +
            "WHERE 1=1 " +
            "<if test=\"disasterType == 'earthquake'\"> AND is_earthquake = 1 </if>" +
            "<if test=\"disasterType == 'tsunami'\"> AND is_tsunami = 1 </if>" +
            "<if test=\"disasterType == 'flood'\"> AND is_flood = 1 </if>" +
            "</script>")
    List<Shelter> findCandidateShelters(@Param("disasterType") String disasterType);

    @Select("SELECT id, name_ja, name_en, address, latitude, longitude, is_earthquake, is_tsunami, is_flood, capacity " +
            "FROM shelters WHERE id = #{id}")
    Shelter findById(@Param("id") Integer id);
}
