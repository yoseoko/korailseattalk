# 자리톡 Windows 데스크톱

자리톡의 데스크톱 모드는 안드로이드 앱과 동일한 React 화면과 조회·감시·예매 흐름을 사용합니다. 코레일 및 텔레그램 요청은 클라우드 중계 서버를 거치지 않고, 실행 중인 컴퓨터의 데스크톱 프로세스에서 해당 서비스로 직접 전송됩니다.

## Windows 실행 파일

GitHub의 **Releases**에서 최신 `JariTalk-*-win-x64.exe` 파일을 내려받아 실행하면 됩니다. 설치 과정이나 별도의 Node.js 설치 없이 Windows 11 64비트 PC에서 단독으로 실행됩니다.

릴리스는 `main` 브랜치에 반영될 때 GitHub Actions가 자동으로 만들며, 필요하면 Actions 화면에서 수동으로도 실행할 수 있습니다.

## 개발 실행

프로젝트 의존성을 설치한 뒤 아래 명령으로 개발용 데스크톱 앱을 실행합니다.

```bash
npm run desktop
```

데스크톱 브리지는 코레일(`smart.letskorail.com`)과 텔레그램(`api.telegram.org`) 요청만 허용하며, 렌더러 화면에는 Node 권한을 노출하지 않습니다.

Windows 배포 파일은 아래 명령으로 만들 수 있습니다.

```bash
npm run desktop:pack
```
