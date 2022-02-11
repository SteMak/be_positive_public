package main

import (
	"fmt"
	"net/http"
	"os"
	"regexp"
)

func main() {
	DirPath := os.Args[1]
	fs := http.FileServer(http.Dir(DirPath))

	mux := http.NewServeMux()
	mux.Handle("/", fs)
	mux.HandleFunc("/new", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, DirPath+"/index.html")
	})
	mux.HandleFunc("/account", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, DirPath+"/index.html")
	})

	http.Handle("/", AdaptFileServer(fs, mux))

	ListenOnPort := os.Getenv("SITE_SERVING")
	fmt.Printf("Server is listening on http://localhost:%s ...\n", ListenOnPort)
	err := http.ListenAndServe(":"+ListenOnPort, nil)
	if err != nil {
		fmt.Printf("ERROR: trouble with listening port (%s)\n", err.Error())
		return
	}
}

func AdaptFileServer(fs http.Handler, mux http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, req *http.Request) {
		StaticRegex := regexp.MustCompile("^/account_.+")
		if matches := StaticRegex.FindStringSubmatch(req.URL.Path); matches != nil {
			fmt.Println(req.URL.Path, matches)
			fsHandler := http.StripPrefix(matches[0], fs)
			fsHandler.ServeHTTP(w, req)
		} else if mux != nil {
			mux.ServeHTTP(w, req)
		} else {
			http.Error(w, "Page Not Found", http.StatusNotFound)
		}
	}

	return http.HandlerFunc(fn)
}
