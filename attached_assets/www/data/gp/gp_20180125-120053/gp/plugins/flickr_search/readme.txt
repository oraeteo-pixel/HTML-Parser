플리커 이미지 검색 플러그인
============================

Plugin Name: 스키넬 플리커
Description: 플리커( http://flickr.com )에서 이미지를 검색해서 게시물에 첨부합니다. 첨부파일로 첨부하는 것이 아닌, 플리커 이미지를 링크합니다.
Plugin URI: http://lovelyus.net/plugins/g5/flickr_search
Author: Chongmyung Park
Author URI: http://byfun.com
Version: 1.2.4
Platform: GPF5
Plugin Scope: BOARD
Required GPF Version: 5.0.0
Tested up to: 5.0.4
Donation URI: http://lovelyus.net/donation
Tags: 플리커, 검색, 이미지, 짤방
Plugin License: GPLv2

글만 쓰면 밋밋한 하고, 이미지를 검색해서 첨부하기엔 번거럽기도 하고 저작권 문제에 걸릴것 같기도 합니다. 
이럴때 사용하기 좋은 플러그인입니다.

플리커 이미지 검색 플러그인은 이미지를 검색해서 게시물에 첨부하고, 뷰페이지에서 보여지도록 하는 플러그인입니다.
실제로 이미지를 그누보드의 첨부파일로 첨부하는 것은 아니며, 따로 DB에 저장하고 게시글 보기에서 이미지를 출력합니다.


특징
-----

  - Flickr 이미지 검색 후 등록
  - 설정에서 검색할 이미지 라이선스를 선택할 수 있음 (CC BY, NC, ND, SA)
  - 이미지 검색시 정렬 방법 선택 가능
  - Flickr 이미지를 보여주기 때문에 서버의 네트워크를 사용하지 않아, 저용량 호스팅에 유리


요구사항
--------

  - 그누보드5 최신버전 : [http://sir.co.kr](http://sir.co.kr "http://sir.co.kr") 
  - **GPF** 최신버전
  - **스키넬 스킨** : [스키넬 스킨 링크](http://lovelyus.net/skins/g5/board/skinel "러블리어스 스킨 디렉토리") 

설치
----
   - 그누보드 관리자 페이지의 '플러그인 > 플러그인 설치' 에서 원격으로 설치 또는 <g5>/gp/plugins 에 업로드
   - 플러그인을 활성화 하고, 설정 페이지에 플리커 API 를 입력 (설정페이지에 링크 참조)

업데이트
--------
  - 1.2.4 (2014-08-26)
    - phpFlickr API 프로토콜 수정 : http -> https
  - 1.2.2 (2013-11-05)
    - 스키넬 테마 적용 시 목록에 썸네일 보이도록 수정
  - 1.2.1 (2013-10-12)
    - GPF 5.0.4 대응 (do.php, admin_do.php)
  - 1.2.0 (2013-09-16)
    - G5 로 업그레이드
  - 1.0.1 (2013-09-03)
    - 이미지 검색폼에 label 추가 (웹접근성 향상 위해)
