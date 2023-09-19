# Build the manager binary
FROM --platform=$BUILDPLATFORM harbor-repo.vmware.com/workloadlb/golang:1.21-alpine AS builder
ARG TARGETOS TARGETARCH
ARG ldflags
WORKDIR /workspace
# Copy the Go Modules manifests
COPY go.mod go.mod
COPY go.sum go.sum
# cache deps before building and copying source so that we don't need to re-download as much
# and so that source changes don't invalidate our downloaded layer
# RUN go env -w GOPROXY=https://goproxy.cn,direct
RUN go mod download
# Copy the go source
COPY cmd/ cmd/
COPY pkg/ pkg/
# Build
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -ldflags "${ldflags}" -a -o inframanager ./cmd/inframanager/main.go
# Use distroless as minimal base image to package the manager binary
# Refer to https://github.com/GoogleContainerTools/distroless for more details
FROM --platform=$TARGETPLATFORM harbor-repo.vmware.com/workloadlb/ubuntu:22.10
ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /
COPY --from=builder /workspace/inframanager .
USER 8080:8080

ENTRYPOINT ["/inframanager"]