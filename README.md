# BlosSum_Backend

MoneyBlosSum의 json-server 백엔드 저장소입니다.

## 실행

```bash
npm install
npm run dev
```

기본 주소: `http://localhost:3000`

## 배포 (Railway)

- Root Directory: `/`
- Build Command: 비우기(기본 install 사용) 또는 `npm install`
- Start Command: `npm start`

### Railway Volume 권장 설정

컨테이너 내부 파일 대신 Railway Volume에 `db.json`을 저장하도록 시작 스크립트를 바꿨습니다.

- Volume Mount Path: `/data`
- 별도 설정이 없으면 Railway 환경에서는 기본 저장 경로로 `/data/db.json` 사용
- seed 원본은 레포의 `db.json`

처음 배포하거나 volume 파일이 없으면:

- `db.json` -> `/data/db.json` 으로 자동 복사

이미 volume 파일이 있는데 seed로 강제 복구하고 싶으면 일시적으로 환경변수를 추가합니다.

- `DB_FORCE_SEED=1`

복구 배포가 끝나면 이 값은 다시 제거하는 편이 안전합니다.
