# Editor for Tistory

**Editor for Tistory** 는 [Tistory의 API](http://www.tistory.com/guide/api/oauth)를 사용하여 티스토리에 글을 작성하고 작성한 글을 관리하는 목적으로 만들고 있습니다.

![](https://joostory.github.io/tistory-editor/image/screenshot_mac.png)

## run

```
$ npm run app
```

## 개발

```
# react build (development)
$ npm run watch

# react build (production)
$ npm run build

# electron start
$ npm run app
```

## 앱 생성 (배포)

```
# 현재 플랫폼으로 앱생성
$ npm run dist

# 윈도우 앱생성
$ npm run dist-win

# 리눅스 앱생성 (AppImage)
$ npm run dist-linux

# 맥 앱생성 (dmg)
$ npm run dist-mac

# 윈도우, 리눅스(AppImage), 맥(zip) 앱 생성
$ npm run dist-all
```
