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


#### 특징
 - Region별로 Service와 Ingress가 독립적으로 구성됨
 - GSLB는 트래픽을 차등 분배 방식으로 전달 
   - 예: 일정 구간 동안 한 리전에 집중 후, 다른 리전으로 분배

#### 문제점
 - 사용자가 최초 접속 시 특정 리전에 할당되면, 재연결도 해당 리전으로 이루어져야 원활한 연결 가능 
 - 하지만 트래픽이 다른 리전으로 분산될 경우, Pod 탐색 과정에서 불필요한 지연이 발생




