<?
/**
 * 소셜로그인(Social Login) - 네이버
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

error_reporting(E_ALL);
ini_set('display_errors', '1');


include_once 'class.lusl.php';

class LUSLNaver extends LUSL
{
    var $api_url = '';
    var $api_key = '';

    function __construct()
    {
        parent::__construct();
        $this->api_client_id = trim($this->plugin_config['nv_client_id']);
        $this->api_secret = trim($this->plugin_config['nv_client_secret']);
        include_once dirname(__FILE__).'/../lib/naver/naver.php';
    }

    function _get_callback_url($md='login')
    {
      return GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=callback_naver&md=' . $md;
    }

    function login()
    {
        $this->_redirect('login');
    }

    function connect()
    {
        $this->_redirect('connect');
    }

    function _redirect($md = 'login')
    {
        if ($md == 'connect') set_session('oauth_naver_md', 'connect');
        else set_session('oauth_naver_md', false);

        $nOauth = new NaverOAuth($this->api_client_id, $this->api_secret, $this->_get_callback_url($md));
        $nOauth-> set_state();
        goto_url($nOauth-> get_request_url());
    }

    function callback()
    {
        $md = get_session('oauth_naver_md');
        $nOauth = new NaverOAuth($this->api_client_id, $this->api_secret, $state);
        $nOauth-> call_accesstoken();
        $user = $nOauth-> get_user_profile();

        if(!$user['id']) {
          alert('소셜로그인: 로그인 실패', $this->getRedirectUrl());
          return;
        }

        $su = $this->getSocialUser('NV', $user['id']);

        $social_user = array('type' => 'NV',
            'name' => $user['nickname'],
            'nickname' => $user['nickname'],
            'email' => $user['email'],
            'social_id' => $user['id'],
            'homepage' => '');

        set_session('sses_social_user', $social_user);

        if ($md == 'connect') $this->connect_proc();
        else if ($su) $this->login_proc();
        else goto_url(GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=signup_proc');
    }
}

?>
