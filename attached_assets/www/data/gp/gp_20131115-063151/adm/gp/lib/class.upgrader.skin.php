<?php
/**
 * GPF 스킨 업그레이드 클래스
 *
 * 러블리어스 {@link http://lovelyus.net} 에서 스킨을 다운받아
 * 설치 및 업그레이드 하거나, 로컬 스킨을 삭제한다.
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 

include_once dirname(__FILE__) . DS . 'class.upgrader.php';

/**
 * SkinUpgrader 
 * 
 * @uses GPUpgrader
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
class SkinUpgrader extends GPUpgrader {

    /**
     * 스킨 디렉토리명
     *
     * @var string
     * */
    var $skin;

    /**
     * 스킨 유형 (board, member, latest ...)
     *
     * @var string
     * */
    var $skin_type;

    /**
     * 스킨 버전
     *
     * @var string
     * */
    var $version;

    /**
     * 다운로드할 스킨 파일명
     *
     * @var string
     * */
    var $filename;

    /**
     * 실행 모드
     *
     * @var string
     * */
    var $md;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        global $md, $skin, $skin_type, $version, $filename;
        if (!$skin_type || !$skin)
            alert('잘못된 연결');
        parent::__construct();
        $this->basic_info = array_merge($this->basic_info, compact('skin', 'skin_type', 'version'));
        $this->md = $md;
        $this->skin = $skin;
        $this->skin_type = $skin_type;
        $this->version = $version;
        $this->filename = $filename;
    }

    /**
     * doit 
     *
     * <gp_admin>/updater.php 에서 호출하는 페이지로,
     * $md 값에 따라서 스킨 설치, 업그레이드, 삭제 기능을 수행
     * 
     * @param string $md 실행모드
     * @access public
     * @return void
     */
    function doit($md) {
        $this->load_filemanager();

        if ($md == 'install')
            $this->installSkin();
        else if ($md == 'upgrade')
            $this->upgradeSkin();
        else if ($md == 'remove')
            $this->uninstallSkin();
        else
            alert('잘못된 연결 : ' . $md);
    }

    /**
     * installSkin 
     *
     * 스킨 설치
     *
     * 설치 프로세스
     *   1. 러블리어스에서 스킨 파일 다운로드 : <g5>/data/gp/downloaded_skin/<SKIN_FILE>.zip 에 저장
     *   2. 스킨 압축 해제 : <g5>/data/gp/downloaded_skin/ 에 압축해제
     *   3. 업그레이드 모드 이면 기존의 스킨 삭제
     *   4. 스킨 복사 : <g5>/skin/<SKIN_TYPE>/<SKIN> 로 이동
     *   5. 다운로드 데이터 삭제
     * 
     * @access public
     * @return void
     */
    function installSkin($is_upgrade = false) {
        @chmod(G5_DATA_PATH, 0777);
        @chmod(GP_DATA_PATH, 0777);
        @chmod($this->down_path, 0777);

        $this->flush('"' . $this->skin . '" 스킨을 다운로드합니다.... ');
        $url = gp_api_url('download_skin', $this->basic_info);
        if (!$url)
            alert('API 키를 설정하신 후 사용하세요');
        $zip_file = $this->down_path . DS . $this->filename;
        @unlink($zip_file);
        list($code, $header, $res, $downloaded) = gp_http_download($url, $zip_file);
        if (!$downloaded) {
            $this->error(' [ 실패 - ' . $code . ' ] <br/>');
            $this->error('* ' . $res . '<br/>');
            $this->_tail();
            return;
        }
        $this->desc(' [ 완료 ] <br/>');

        $this->flush('스킨 압축 파일을 풉니다....');
        $dirname = $this->unzip($zip_file, $this->down_path);
        $dirpath = $this->down_path . DS . $dirname;
        if ($dirname)
            $this->desc(' [ 완료 ] <br/>');
        else {
            $this->error(' [ 실패 ] <br/>');
            unlink($zip_file);
            $this->_tail();
            return;
        }

        if ($is_upgrade)
            $this->uninstallSkin($print_tail = false);

        $this->flush('스킨을 스킨 디렉토리로 이동합니다....');
        $target_path = G5_SKIN_PATH . DS . $this->skin_type . DS . $dirname;
        if (!$this->fs->mkdir($this->_remote_path($target_path)))
            alert('디렉토리 생성에 실패 하였습니다 : ' . $dirname, $this->backurl);
        $res = $this->copy_dir($dirpath, $target_path);
        if (!$res) {
            $this->error(' [ 실패 ]');
            unlink($zip_file);
            $this->_tail();
            return;
        }
        $this->remove_dir($dirpath);
        $this->desc(' [ 완료 ] <br/>');

        unlink($this->down_path . DS . $this->filename); // remove downloaded zip file
        $this->_tail();
    }

    /**
     * upgradeSkin 
     *
     * 스킨 업그레이드
     *
     * @access public
     * @return void
     */
    function upgradeSkin() {
        $this->installSkin($is_upgrade = true);
    }

    /**
     * uninstallSkin 
     *
     * 스킨 삭제
     *
     * 삭제 프로세스
     *   1. 스킨 삭제 : <g5>/skin/<SKIN_TYPE>/<SKIN> 삭제
     * 
     * @access public
     * @return void
     */
    function uninstallSkin($print_tail = true) {
        $this->flush('설치된 스킨을 제거합니다....');
        $res = $this->fs->delete($this->_remote_path(G5_SKIN_PATH . DS . $this->skin_type . DS . $this->skin), true);
        if ($res)
            $this->desc(' [ 완료 ] <br/>');
        else {
            $this->error(' [ 실패 ] <br/>');
            $this->error('* 다음을 삭제할 수 없습니다 : ' . G5_SKIN_PATH . DS . $this->skin_type . DS . $this->skin . '<br/>');
        }

        if ($print_tail)
            $this->_tail();
    }

    /**
     * _tail 
     *
     * 프로세스 완료 후, 하단 메시지 출력
     * 
     * @access protected
     * @return void
     */
    function _tail() {
        global $md, $skin, $skin_type;
        
        @chmod(G5_DATA_PATH, 0707);
        @chmod(GP_DATA_PATH, 0707);
        @chmod($this->down_path, 0707);
        
        if($md != 'remove' && !$this->has_error) $this->flush('<br/>스킨 정보 페이지로 이동합니다... ');                
        
        $msg = '<br/><a href="skin_install.php?skin_type=' . $this->skin_type . '&' . gp_uparam(TRUE) . '">스킨 설치 페이지로 이동</a> | <a href="skins.php?skin_type=' . $this->skin_type . '&' . gp_uparam(TRUE) . '">스킨 목록 페이지로 이동</a>';
        $this->flush($msg);

        if($md != 'remove' && !$this->has_error) 
        {
            sleep(2);
            goto_url('skininfo.php?skin_type='.$this->skin_type.'&skin='.$this->skin.'&'.gp_uparam(TRUE));
        }    
    }

}

?>
