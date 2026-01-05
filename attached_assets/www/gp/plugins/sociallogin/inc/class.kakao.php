<?
/**
 * 소셜로그인(Social Login) - 구글
 *
 * @package net.lovelyus.plugins.sociallogin
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license 프로그램의 수정 및 배포를 금합니다.
 * @link http://lovelyus.net
 **/
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

include_once 'class.lusl.php';

class LUSLKakao extends LUSL
{

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
        if ($md == 'connect') set_session('oauth_kakao_md', 'connect');
        else set_session('oauth_kakao_md', false);
        goto_url($this->_get_login_url());
    }

    function callback()
    {
        $md = get_session('oauth_kakao_md') ? 'connect' : 'login';

        $token_str = $this->_get_token();

        if (!$token_str) {
            alert('소셜로그인: 로그인 실패', $this->getRedirectUrl());
            return;
        }

        $json = json_decode($token_str);

        $profile_str = $this->_get_profile($json->access_token);
        if (!$profile_str) {
            alert('소셜로그인: 로그인 실패', $this->getRedirectUrl());
            return;
        }

        $user = json_decode($profile_str);
        $user_id = $user->id;
        $prop = $user->properties;

        if(!$user_id) {
            alert('소셜로그인: 로그인 실패 ('.$user->code.':'.$user->msg.')', $this->getRedirectUrl());
            return;
        }

        $user_name = filter_var($prop->nickname, FILTER_SANITIZE_SPECIAL_CHARS);
        $email = '';
        $thumbnail_image = filter_var($prop->thumbnail_image, FILTER_VALIDATE_URL);
        $profile_image = filter_var($prop->profile_image, FILTER_VALIDATE_URL);

        $su = $this->getSocialUser('KT', $user_id);

        $social_user = array('type' => 'KT',
            'name' => $user_name,
            'nickname' => $user_name,
            'email' => $email,
            'social_id' => $user_id,
            'homepage' => '');

        set_session('sses_social_user', $social_user);

        if ($md == 'connect') $this->connect_proc();
        else if ($su) $this->login_proc();
        else goto_url(GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=signup_proc');
    }

    function _get_api_key()
    {
        return $this->plugin_config['kt_api_key'];
    }

    function _get_redirect_url()
    {
        return urlencode(GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=callback_kakao');
    }

    function _get_login_url()
    {
        return 'https://kauth.kakao.com/oauth/authorize?client_id=' . $this->_get_api_key()
        . '&redirect_uri=' . $this->_get_redirect_url() . '&response_type=code';
    }

    function _get_token()
    {
        $CLIENT_ID = $this->_get_api_key();
        $REDIRECT_URI = $this->_get_redirect_url();

        $code = $_GET["code"];
        $params = sprintf('grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s', $CLIENT_ID, $REDIRECT_URI, $code);
        $opt = array(
            CURLOPT_URL => 'https://kauth.kakao.com/oauth/token',
            CURLOPT_POSTFIELDS => $params
        );
        return $this->_request($opt);
    }

    function _get_profile($access_token)
    {
        $opt = array(
            CURLOPT_URL => 'https://kapi.kakao.com/v1/user/me',
            CURLOPT_HTTPHEADER => array("Authorization: Bearer " . $access_token)
        );
        return $this->_request($opt);
    }

    function _request($req_opt)
    {
        $opts = array(
            CURLOPT_URL => '',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSLVERSION => 1,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => false
        );

        foreach($req_opt as $key=>$value)
        {
            $opts[$key] = $value;
        }

        $curlSession = curl_init();
        curl_setopt_array($curlSession, $opts);
        $response = curl_exec($curlSession);
        curl_close($curlSession);
        return $response;
    }
}

?>
