REPO_ROOT := $(shell pwd)

BIN_DIR := bin

LDFLAGS ?= -s -w

all: modules format build 
## --------------------------------------
## Linting
## --------------------------------------
.PHONY: format
format: fmt vet

fmt: ## Run go fmt against code. 
	go fmt $(shell go list ./...)

vet: ## Run go vet against code.
	go vet $(shell go list ./...)
## --------------------------------------
## Binaries
## --------------------------------------
.PHONY: build
build: modules 
	go build -o $(BIN_DIR)/accounter main.go
	cd frontend; npm run build
## --------------------------------------
## Documents
## -------------------------------------- 	
# Generate swag API file
.PHONY: swag
swaginframanager: swagbin swagfmt
	$(SWAGBIN) init --parseDependency --parseInternal

swagfmt:swagbin
	$(SWAGBIN) fmt pkg

SWAGBIN ?= $(LOCALBIN)/swag
## Location to install dependencies to
LOCALBIN ?= $(shell pwd)/bin
$(LOCALBIN):
	mkdir -p $(LOCALBIN)

swagbin: $(SWAGBIN) ## Download kustomize locally if necessary.
$(SWAGBIN): $(LOCALBIN)
	test -s $(LOCALBIN)/swag || GOBIN=$(LOCALBIN) GO111MODULE=on go install github.com/swaggo/swag/cmd/swag@latest
## --------------------------------------
## Modules
## --------------------------------------
.PHONY: modules
modules: ## Runs go mod to ensure modules are up to date.
	go mod tidy

## --------------------------------------
## OCI images
## --------------------------------------
TAG ?= latest

images:
	docker buildx build --platform linux/amd64 --build-arg ldflags="$(LDFLAGS)" -f Dockerfile -t accounter:$(TAG) . --load	
