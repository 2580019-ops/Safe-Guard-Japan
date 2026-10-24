package com.safeguardjapan.model;

public class Phrase {
    private Integer id;
    private String category;
    private String textJa;
    private String textEn;
    private String textBn;
    private String textVi;
    private Integer sortOrder;

    public Phrase() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTextJa() { return textJa; }
    public void setTextJa(String textJa) { this.textJa = textJa; }

    public String getTextEn() { return textEn; }
    public void setTextEn(String textEn) { this.textEn = textEn; }

    public String getTextBn() { return textBn; }
    public void setTextBn(String textBn) { this.textBn = textBn; }

    public String getTextVi() { return textVi; }
    public void setTextVi(String textVi) { this.textVi = textVi; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
