package record

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const urlpath = "/records"

type record struct {
	gorm.Model
	Date    time.Time `json:"date"`
	Number  int       `json:"number"`
	Account string    `json:"account"`
	Person  string    `json:"person"`
	Cate1   string    `json:"cate1"`
	Cate2   string    `json:"cate2"`
	Detail  string    `json:"detail"`
}

type recordshandle struct {
	db    *gorm.DB
	group *gin.RouterGroup
}

func NewRecordshandle(group *gin.RouterGroup, db *gorm.DB) *recordshandle {
	var r recordshandle
	r.db = db
	r.group = group
	db.AutoMigrate(&record{})
	group.POST(urlpath, r.newrecord)
	group.GET(urlpath, r.list)
	group.GET("/accounts", r.listaccouts)
	group.GET("/persons", r.listpersons)
	group.GET("/categorys", r.listcategory)
	group.DELETE(urlpath, r.deleterecord)
	group.PUT(urlpath, r.updaterecord)
	return &r
}

func (h *recordshandle) newrecord(c *gin.Context) {
	var r record
	err := c.ShouldBindJSON(&r)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = h.db.Create(&r).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, r)
}

func (h *recordshandle) list(c *gin.Context) {
	var r []record
	rest := h.db.Find(&r)
	if rest.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rest.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, &r)
}

func (h *recordshandle) deleterecord(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id must not empty"})
		return
	}
	err := h.db.Delete(&record{}, id).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, "{}")
}

func (h *recordshandle) updaterecord(c *gin.Context) {
	var r record
	err := c.ShouldBindJSON(&r)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if r.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id must not empty"})
		return
	}
	err = h.db.Save(&r).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, "{}")
}

func (h *recordshandle) listaccouts(c *gin.Context) {
	var r []string
	rest := h.db.Model(&record{}).Distinct("Account").Find(&r)
	if rest.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rest.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, &r)
}

func (h *recordshandle) listpersons(c *gin.Context) {
	var r []string
	rest := h.db.Model(&record{}).Distinct("Person").Find(&r)
	if rest.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rest.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, &r)
}

func (h *recordshandle) listcategory(c *gin.Context) {
	r := map[string][]string{}
	var cate1 []string
	rest := h.db.Model(&record{}).Distinct("Cate1").Find(&cate1)
	if rest.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rest.Error.Error()})
		return
	}
	for _, ca := range cate1 {
		var cate2 []string
		rest = h.db.Model(&record{}).Distinct("Cate2").Where("Cate1 = ?", ca).Find(&cate2)
		if rest.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": rest.Error.Error()})
			return
		}
		r[ca] = cate2
	}
	c.JSON(http.StatusOK, &r)
}
