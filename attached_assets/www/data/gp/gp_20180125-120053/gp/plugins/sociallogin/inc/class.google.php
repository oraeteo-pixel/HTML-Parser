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

class LUSLGoogle extends LUSL
{
    function _get_redirect_url()
    {
        return GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=callback_google';
    }

    function _get_client()
    {
        include_once $this->plugin_path . DS . 'lib' . DS . 'google' . DS . 'Google_Client.php';
        include_once $this->plugin_path . DS . 'lib' . DS . 'google' . DS . 'contrib' . DS . 'Google_Oauth2Service.php';

        $google_client_id = $this->plugin_config['gg_client_id'];
        $google_client_secret = $this->plugin_config['gg_client_secret'];
        $google_redirect_url = $this->_get_redirect_url();

        $gClient = new Google_Client();
        $gClient->setApplicationName('Google Login');
        $gClient->setClientId($google_client_id);
        $gClient->setClientSecret($google_client_secret);
        $gClient->setRedirectUri($google_redirect_url);
        $google_oauthV2 = new Google_Oauth2Service($gClient);
        return array($gClient, $google_oauthV2);
    }

    function login()
    {
        $this->redirect('login');
    }

    function connect()
    {
        $this->redirect('connect');
    }

    function redirect($md = 'login')
    {
        if ($md == 'connect') set_session('oauth_google_md', 'connect');
        else set_session('oauth_google_md', false);

        list($gClient, $oauth) = $this->_get_client();
        $authUrl = $gClient->createAuthUrl();
        goto_url($authUrl);
    }

    function callback()
    {
        $md = get_session('oauth_google_md') ? 'connect' : 'login';

        list($gClient, $oauth) = $this->_get_client();
        if (isset($_GET['code'])) {
            try {
              $gClient->authenticate($_GET['code']);
              $_SESSION['gtoken'] = $gClient->getAccessToken();
            } catch(Exception $ex) {
              alert('소셜로그인 : 인증 실패 (Client ID 와 Secret 을 정확히 입력하세요', $this->getRedirectUrl());
            }
        }

        if ($gClient->getAccessToken()) {
            //For logged in user, get details from google using access token
            $user = $oauth->userinfo->get();
            $user_id = $user['id'];
            $user_name = filter_var($user['name'], FILTER_SANITIZE_SPECIAL_CHARS);
            $email = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
            $profile_url = filter_var($user['link'], FILTER_VALIDATE_URL);
            $profile_image_url = filter_var($user['picture'], FILTER_VALIDATE_URL);
            $personMarkup = "$email<div><img src='$profile_image_url?sz=50'></div>";
            $_SESSION['token'] = $gClient->getAccessToken();
        }

        if (!$user) alert('소셜로그인: 로그인 실패', $this->getRedirectUrl());

        $su = $this->getSocialUser('GG', $user_id);

        $social_user = array('type' => 'GG',
            'name' => $user_name,
            'nickname' => $user_name,
            'email' => $email,
            'social_id' => $user_id,
            'homepage' => $profile_url);

        set_session('sses_social_user', $social_user);

        if ($md == 'connect') $this->connect_proc();
        else if ($su) $this->login_proc();
        else goto_url(GP_URL . '/do.php?id=' . $this->id . '&act=sociallogin&s=signup_proc');
    }
}

?>
