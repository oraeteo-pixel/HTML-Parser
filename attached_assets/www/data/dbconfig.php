<?php
if (!defined('_GNUBOARD_')) exit;
define('G5_MYSQL_HOST', 'localhost');
define('G5_MYSQL_USER', 'siruinmo');
define('G5_MYSQL_PASSWORD', 'tlfn4913');
define('G5_MYSQL_DB', 'siruinmo');

define('G5_TABLE_PREFIX', 'g5_');

$g5['write_prefix'] = G5_TABLE_PREFIX.'write_'; // 게시판 테이블명 접두사

$g5['auth_table'] = G5_TABLE_PREFIX.'auth'; // 관리권한 설정 테이블
$g5['config_table'] = G5_TABLE_PREFIX.'config'; // 기본환경 설정 테이블
$g5['group_table'] = G5_TABLE_PREFIX.'group'; // 게시판 그룹 테이블
$g5['group_member_table'] = G5_TABLE_PREFIX.'group_member'; // 게시판 그룹+회원 테이블
$g5['board_table'] = G5_TABLE_PREFIX.'board'; // 게시판 설정 테이블
$g5['board_file_table'] = G5_TABLE_PREFIX.'board_file'; // 게시판 첨부파일 테이블
$g5['board_good_table'] = G5_TABLE_PREFIX.'board_good'; // 게시물 추천,비추천 테이블
$g5['board_new_table'] = G5_TABLE_PREFIX.'board_new'; // 게시판 새글 테이블
$g5['login_table'] = G5_TABLE_PREFIX.'login'; // 로그인 테이블 (접속자수)
$g5['mail_table'] = G5_TABLE_PREFIX.'mail'; // 회원메일 테이블
$g5['member_table'] = G5_TABLE_PREFIX.'member'; // 회원 테이블
$g5['memo_table'] = G5_TABLE_PREFIX.'memo'; // 메모 테이블
$g5['poll_table'] = G5_TABLE_PREFIX.'poll'; // 투표 테이블
$g5['poll_etc_table'] = G5_TABLE_PREFIX.'poll_etc'; // 투표 기타의견 테이블
$g5['point_table'] = G5_TABLE_PREFIX.'point'; // 포인트 테이블
$g5['popular_table'] = G5_TABLE_PREFIX.'popular'; // 인기검색어 테이블
$g5['scrap_table'] = G5_TABLE_PREFIX.'scrap'; // 게시글 스크랩 테이블
$g5['visit_table'] = G5_TABLE_PREFIX.'visit'; // 방문자 테이블
$g5['visit_sum_table'] = G5_TABLE_PREFIX.'visit_sum'; // 방문자 합계 테이블
$g5['uniqid_table'] = G5_TABLE_PREFIX.'uniqid'; // 유니크한 값을 만드는 테이블
$g5['syndi_log_table'] = G5_TABLE_PREFIX.'syndi_log'; // 네이버 신디케이션 컨텐츠 삭제 로그 테이블
$g5['autosave_table'] = G5_TABLE_PREFIX.'autosave'; // 게시글 작성시 일정시간마다 글을 임시 저장하는 테이블
$g5['cert_history_table'] = G5_TABLE_PREFIX.'cert_history'; // 인증내역 테이블
$g5['menu_table'] = G5_TABLE_PREFIX.'menu';
?>