# AutomationControlProject

자동화 설비 제어 프로그램 프로젝트입니다.

## 프로젝트 구조

```text
AutomationControlProject/
 ┣ 📂 src/                  실제 프로그램 소스 코드가 들어가는 핵심 폴더
 ┃ ┣ 📂 main/               메인 실행 파일, 프로그램 진입점
 ┃ ┣ 📂 ui/                 Main 화면, Teach 화면 등 화면 UI
 ┃ ┣ 📂 io/                 입출력 센서/실린더 제어 및 모니터링
 ┃ ┣ 📂 plc/                PLC 통신 모듈 - LS, 미쓰비시, 오므론 등
 ┃ ┣ 📂 camera/             비전 카메라 트리거 및 검사 결과
 ┃ ┣ 📂 motion/             서보 모터, 로봇 축 제어
 ┃ ┣ 📂 recipe/             생산 제품별 모델/설정값 관리
 ┃ ┣ 📂 alarm/              에러 발생 시 알람 처리
 ┃ ┗ 📂 config/             장비 IP 등 환경 설정 파일
 ┣ 📂 docs/                 개발 관련 문서 보관 폴더
 ┃ ┣ 📂 screen_design/      화면 UI 기획서
 ┃ ┗ 📂 io_list/            I/O 할당표, PLC 어드레스 맵
 ┗ 📜 README.md             프로젝트 설명서
```

## 폴더 설명

| 폴더 | 설명 |
| --- | --- |
| `src/main` | 프로그램 진입점 및 메인 실행 로직 |
| `src/ui` | 화면 UI 구성 및 이벤트 처리 |
| `src/io` | 센서, 실린더, 입출력 상태 제어/모니터링 |
| `src/plc` | PLC 통신 및 프로토콜별 모듈 |
| `src/camera` | 비전 카메라 트리거, 검사 결과 수신 |
| `src/motion` | 서보 모터, 로봇 축 제어 |
| `src/recipe` | 제품별 모델, 파라미터, 설정값 관리 |
| `src/alarm` | 에러/알람 정의 및 처리 |
| `src/config` | 장비 IP, 포트, 환경 설정 파일 |
| `docs/screen_design` | 화면 설계서 및 UI 기획 문서 |
| `docs/io_list` | I/O 할당표, PLC 어드레스 맵 문서 |
