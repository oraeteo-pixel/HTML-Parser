<?
/**
 * 소셜로그인(Social Login) 클래스
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

class LUSL
{

    var $id;
    var $plugin_path;
    var $plugin_url;
    var $plugin_config;

    function __construct()
    {
        global $lu_social_login_config;
        $this->plugin_path = dirname(dirname(__FILE__));
        $this->id = gp_plugin_id(dirname(__FILE__));
        $this->plugin_url = gp_plugin_url(dirname(__FILE__));
        $this->plugin_config = gp_read_config(SOCIAL_LOGIN_CONFIG_FILE, array(), GP_SCOPE_SITE);
    }

    function login()
    {
    }

    function connect()
    {
    }

    function callback()
    {
    }

    function connect_proc()
    {
        global $member;

        $social_user = get_session('sses_social_user');
        set_session('sses_social_user', false);
        if (!$social_user) alert('소셜로그인 : 소셜 로그인 정보가 존재하지 않습니다.', $this->getRedirectUrl());

        if (!$member) alert('소셜로그인 : 로그인 후 사용하실 수 있습니다.', $this->getRedirectUrl());

        $su = $this->getSocialUser($social_user['type'], $social_user['social_id']);
        if ($su) alert('소셜로그인 : 이미 연결된 소셜네트워크 계정입니다.', $this->getRedirectUrl());

        sql_query("INSERT INTO gpf_social_users SET mb_id = '{$member['mb_id']}', login_type = '{$social_user['type']}', social_id = '{$social_user['social_id']}', login_date = '" . G5_TIME_YMDHIS . "', reg_date = '" . G5_TIME_YMDHIS . "'");

        $GLOBALS['member']['social'] = $social_user;
        set_session('sses_social_user', $social_user);

        alert('소셜 네트워크 아이디가 연결되었습니다.', $this->getRedirectUrl());
    }

    /**
     * login_proc
     *
     * 로그인
     *
     * @access public
     * @return void
     */
    function login_proc()
    {
        $social_user = get_session('sses_social_user');

        if (!$social_user) alert('소셜로그인 정보가 존재하지 않습니다', $this->getRedirectUrl());

        $su = $this->getSocialUser($social_user['type'], $social_user['social_id']);

        if (!$su) alert('존재하지 않는 사용자 입니다.');

        $mb = get_member($su['mb_id']);

        // 차단된 아이디인가?
        if ($mb['mb_intercept_date'] && $mb['mb_intercept_date'] <= date("Ymd", G5_SERVER_TIME)) {
            $date = preg_replace("/([0-9]{4})([0-9]{2})([0-9]{2})/", "\\1년 \\2월 \\3일", $mb['mb_intercept_date']);
            alert('회원님의 아이디는 접근이 금지되어 있습니다.\n처리일 : ' . $date);
        }

        // 탈퇴한 아이디인가?
        if ($mb['mb_leave_date'] && $mb['mb_leave_date'] <= date("Ymd", G5_SERVER_TIME)) {
            $date = preg_replace("/([0-9]{4})([0-9]{2})([0-9]{2})/", "\\1년 \\2월 \\3일", $mb['mb_leave_date']);
            alert('탈퇴한 아이디이므로 접근하실 수 없습니다.\n탈퇴일 : ' . $date);
        }

        if ($config['cf_use_email_certify'] && !preg_match("/[1-9]/", $mb['mb_email_certify'])) {
            confirm("{$mb['mb_email']} 메일로 메일인증을 받으셔야 로그인 가능합니다. 다른 메일주소로 변경하여 인증하시려면 취소를 클릭하시기 바랍니다.", G5_URL, G5_BBS_URL . '/register_email.php?mb_id=' . $mb_id);
        }

        sql_query("UPDATE gpf_social_users SET login_date = '" . g5_TIME_YMDHIS . "' WHERE mb_id = '{$su['mb_id']}' ");

        // 회원아이디 세션 생성
        set_session('ss_mb_id', $mb['mb_id']);
        // FLASH XSS 공격에 대응하기 위하여 회원의 고유키를 생성해 놓는다. 관리자에서 검사함 - 110106
        set_session('ss_mb_key', md5($mb['mb_datetime'] . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']));

        // 포인트 체크
        if ($config['cf_use_point']) {
            $sum_point = get_point_sum($mb['mb_id']);

            $sql = " update {$g5['member_table']} set mb_point = '$sum_point' where mb_id = '{$mb['mb_id']}' ";
            sql_query($sql);
        }

        set_cookie('ck_mb_id', '', 0);
        set_cookie('ck_auto', '', 0);

        goto_url($this->getRedirectUrl());
    }

    function getRedirectUrl()
    {
        $red = get_session('sses_social_redirect');
        if ($_SERVER['REQUEST_URI'] == $red) $red = '/';
        return ($red ? $red : '/');
    }

    function getSocialUser($type, $id)
    {
        return sql_fetch("SELECT * FROM gpf_social_users WHERE login_type = '$type' AND social_id = '$id'");
    }

    function getSocialUserByMbId($mb_id, $type = '')
    {
        if ($type) $sql_add = " AND login_type = '$type' ";
        return sql_fetch("SELECT * FROM gpf_social_users WHERE mb_id = '$mb_id' $sql_add ");
    }
}
