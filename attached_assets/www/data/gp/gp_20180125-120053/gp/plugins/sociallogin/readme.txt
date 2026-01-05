소셜 로그인
===========

Plugin Name: 소셜 로그인
Description: 구글,페이스북,트위터,카카오톡,네이버를 통해 그누보드에 로그인 및 회원가입할 수 있습니다.
Plugin URI: http://lovelyus.net/plugins/g5/sociallogin
Author: Chongmyung Park
Author URI: http://byfun.com
Version: 1.2.6
Platform: GPF5
Plugin Scope: SITE
Required GPF Version: 5.0.3
Tested up to: 5.0.5
Donation URI: http://lovelyus.net/donation
Tags: 소셜로그인, 구글, 페이스북, 트위터, 카카오톡, 네이버
Plugin License: GPLv2


소셜 네트워크 계정(구글, 페이스북, 트위터, 카카오톡, 네이버)으로 그누보드에 로그인하는 플러그인입니다.

기능
-----
 
  - 비회원이 소셜 네트워크 로그인 이용시 회원가입 유도
  - 기존 회원이 소셜 네트워크 계정 연결 가능

요구사항
---------
  - [CURL for PHP](http://lovelyus.net/v1/bbs/board.php?bo_table=help&wr_id=11 "CURL 설치 확인 방법")
  - 그누보드5 최신버전 (**UTF-8 버전**) : [http://sir.co.kr](http://sir.co.kr "http://sir.co.kr")
  - **GPFv2** 최신버전

시연
----

  - 러블리어스에 로그인 해보세요 ^^

설치
-----

  - '그누보드 관리자 > 플러그인 > 플러그인 설치' 에서 설치 또는 <g4>/gp/plugins/ 에 업로드
  - 플러그인을 활성화 시키고 '설정'에 구글, 페이스북, 트위터, 카카오톡, 네이버 API 정보 입력

소셜 로그인 링크 만드는 방법
-----------------------------
[code php]
  <?php if($is_guest) { ?>
  소셜 네트워크 계정으로 로그인하시겠습니까?
  <?php
  $loginUrls = socialLoginUrls($set_redirect=true, $redirect_url=urldecode($login_url));
  ?>
  <div style="padding:10px">
  <a href='<?php echo $loginUrls['google']; ?>' title='구글로 로그인'>구글로 로그인</a> 
  <a href='<?php echo $loginUrls['facebook']; ?>' title='페이스북으로 로그인'>페이스북 로그인</a> 
  <a href='<?php echo $loginUrls['twitter']; ?>' title='트위터로 로그인'>트위터 로그인</a> <br/>
  <a href='<?php echo $loginUrls['kakao']; ?>' title='카카오톡으로 로그인'>카카오톡 로그인</a> <br/>
  <a href='<?php echo $loginUrls['naver']; ?>' title='네이버로 로그인'>네이버 로그인</a> <br/>
  </div>
  <?php } ?>
[/code]

기존 그누보드 계정을 소셜 네트워크 계정과 연결/해지 시키는 방법
----------------------------------------------------------------

  - 보통 head.php 를 작성할 때 다음과 같이 작성할 것입니다.
[code php]
<?
if($is_guest) {
  // 로그인 안한 경우 메뉴 
} else {
  // 로그인 했을 경우 메뉴
}
?>
[/code]
  - 이때 소셜 네트워크 계정 연결은 '로그인 했을 경우' 에 다음과 같이 코드를 넣습니다.
[code php]
<?php
if($is_guest) {
  // 로그인 안한 경우 메뉴 
} else {
  // 로그인 했을 경우 메뉴
  if(!socialAccount($member['mb_id'])) {
    ?><a href='<?php echo socialConnectUrl($_SERVER['REQUEST_URI']); ?>'>소셜계정 연결</a><?php
  } else if('GSU_' != substr($member['mb_id'], 0, 4)) {
    ?><a href="<?php echo socialDisConnectUrl($_SERVER['REQUEST_URI']); ?>">소셜계정 연결 해지</a><?php
  }
}
?>
[/code]

API 설정 방법
-------------
 
  - '그누보드 관리자 > 플러그인 > 소셜 로그인 > 설정' 메뉴에 입력
    - 구글 Client Id 와 secret 입력
    - 페이스북 App Id 와 secret 입력
    - 트위터 Consumer key 와 secret 입력
    - 카카오톡 REST API Key 입력
    - 네이버 Client Id 와 secret 입력
  - 구글 App 설정의 Callback URL 은 다음과 같이 설정합니다.
    - http://그누보드/gp/do.php?id=sociallogin&act=sociallogin&s=callback_google
  - 트위터 App 설정의 Callback URL 은 다음과 같이 설정합니다.
    - http://그누보드/gp/do.php?id=sociallogin&act=sociallogin&s=callback_twitter 
  - 카카오톡 App 설정의 Callback URL 은 다음과 같이 설정합니다.
    - [/그누보드/]/gp/do.php?id=sociallogin&act=sociallogin&s=callback_kakao
  - 네이버 App 설정의 Callback URL 은 다음과 같이 설정합니다.
    - http://그누보드/gp/do.php?id=sociallogin&act=sociallogin&s=callback_naver


업데이트
---------
  - 1.2.6 (2015-02-28)
    - 카카오톡 로그인 추가
    - 네이버 로그인 추가
    - 구글 로그인 버전 변경 (구버전 서비스 종료)
    - 미투데이 로그인 기능 제거 (미투데이 로그인 서비스 종료)
  - 1.2.5 (2013-11-21)
    - 사이트 회원 가입시에도 소셜 사용자로만 가입되는 문제 수정
  - 1.2.4 (2013-10-24)
    - 미투데이 로그인 기능 추가
    - login_type 은 set 에서 varchar 로 조정
  - 1.2.3 (2013-10-22)
    - 메일인증 기능 사용 시 소셜로그인에도 메일인증 기능 적용
    - 회원가입시 메일발송 오류 수정
  - 1.2.2 (2013-10-21)
    - 소셜로그인 자동 아이디 생성 시 mb_id 를 20bytes 로 조정
    - HTTPOpenSSL 플러그인과 같이 사용시 정보 수정 페이지로 이동 오류 수정
  - 1.2.1 (2013-10-12)
    - GPF 5.0.4 대응 (do.php, admin_do.php)
  - 1.2.0 (2013-09-16)
    - G5 버전 대응
  - 1.0.1 (2013-09-05)
    - 소셜로그인에도 이름과 이메일은 필수로 입력하도록 수정 (계정에 따라 이름이 없이 생성되는 버그가 있었음)
