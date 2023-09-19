package accounter

import (
	"flag"

	"account/pkg/record"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const apiversion = "v1"

type accflag struct {
	dbfile   string
	listen   string
	frontend string
}

type Accounter struct {
	db     *gorm.DB
	e      *gin.Engine
	fs     accflag
	logger *logrus.Logger
}

func NewAccounter() *Accounter {
	var acc Accounter
	flag.StringVar(&acc.fs.listen, "l", ":8080", "account listen port")
	flag.StringVar(&acc.fs.dbfile, "dbfile", "account.db", "data base file")
	flag.StringVar(&acc.fs.frontend, "root frontend", "./frontend/build", "data base file")
	flag.Parse()

	engine := gin.New()
	engine.Use(gin.Recovery(), CORSMiddleware())
	// Serve frontend static files
	engine.Use(static.Serve("/", static.LocalFile(acc.fs.frontend, true)))
	v1 := engine.Group("/api/" + apiversion)

	acc.e = engine
	acc.logger = logrus.New()

	db, err := gorm.Open(sqlite.Open(acc.fs.dbfile), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	acc.db = db
	record.NewRecordshandle(v1, db)
	return &acc
}

func (a *Accounter) Run() {
	a.e.Run(a.fs.listen)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
