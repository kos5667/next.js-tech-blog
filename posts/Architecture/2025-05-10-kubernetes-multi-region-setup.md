<!--
title: Multi IDC Region 활용을 위한 k8s 설정
tags: k8s,Architecture,node.js
allow_publishing: false
-->

## outline
최근 담당하는 채팅 서비스는 [**Multi IDC 환경을 도입**](#)했지만, 특정 상황에서 DNS 캐싱으로 인한 연결 지연 문제가 발생했습니다.
이로 인해 유저가 사용자에게 연결될 때 최대 6~10분의 지연이 발생할 수 있었으며, Multi IDC의 장점을 충분히 살리지 못하는 상황이었습니다.

이를 개선하기 위해 Kubernetes(K8s) 구성 변경을 진행하였습니다.


## 변경 전 k8s 구성도 및 원인

![변경 젼 k8s 구성도](../../static/images/architecture/kubernetes-multi-region-setup-1.png)

### 변경 전 k8s 구조.
 - 최초 접속은 정상적으로 이루어지지만
 - 재접속 시 지연이 발생하는 경우가 많음
 - 이는 GSLB 정책에 따른 DNS 캐싱 영향 때문임
 - 특정 리전에 캐싱된 DNS가 고정되면서, 이후 요청이 다른 리전으로 전달될 경우 연결 지연 발생








