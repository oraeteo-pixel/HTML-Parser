<?php
/**
 * GPF 플러그인 업그레이드 클래스
 *
 * 러블리어스 {@link http://lovelyus.net} 에서 플러그인을 다운받아
 * 설치 및 업그레이드 하거나, 로컬 플러그인을 삭제한다.
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
 * PluginUpgrader 
 * 
 * @uses GPUpgrader
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
class UploadPluginUpgrader extends GPUpgrader {

    /**
     * 업로드된 플러그인 아이디
     *
     * @var string
     * */
    var $uploaded_plugin_id;

    /**
     * 업로드된 플러그인 zip 파일 경로
     *
     * @var string
     * */
    var $uploaded_zip_file;

    /**
     * 플러그인 업로드 경로
     *
     * @var string
     * */
    var $upload_path;

    /**
     * __construct 
     * 
     * @access protected
     * @return void
     */
    function __construct() {
        parent::__construct();
        $this->upload_path = GP_DATA_PATH . DS . 'uploaded_plugin';
        @mkdir($this->upload_path, 0707);
        @chmod($this->upload_path, 0707);
        $this->uploaded_zip_file = $_REQUEST['uploaded_zip_file'];
        $this->uploaded_plugin_id = $_REQUEST['uploaded_plugin_id'];
    }

    /**
     * doit 
     *
     * <gp_admin>/updater.php 에서 호출하는 페이지로,
     * $md 값에 따라서 플러그인 설치, 업그레이드, 삭제 기능을 수행
     * 
     * @param string $md 실행모드
     * @access public
     * @return void
     */
    function doit($md) {
        //$this->load_filemanager();
        if ($md == 'upload')
            $this->uploadPlugin();
        else if ($md == 'install')
            $this->installPlugin();
        else
            alert('잘못된 연결 : ' . $md);
    }

    function uploadPlugin() {
        $filename = basename($_FILES['plugin_zip_file']['name']);

        if (pathinfo($filename, PATHINFO_EXTENSION) != 'zip')
            alert('ZIP 파일이 아닙니다.');

        $uploadfile = $this->upload_path . DS . $filename;

        if (!move_uploaded_file($_FILES['plugin_zip_file']['tmp_name'], $uploadfile)) {
            alert('업로드에 실패하였습니다.');
            return;
        }

        $plugin_id = $this->unzip($uploadfile, $this->upload_path);

        if (!file_exists($this->upload_path . DS . $plugin_id . DS . 'readme.txt')) {
            unlink($uploadfile);
            $this->remove_dir($this->upload_path);
            alert("첨부파일에 플러그인 정보 파일(readme.txt)이 존재하지 않습니다.");
            return;
        }

        $this->uploaded_zip_file = $uploadfile;
        $this->uploaded_plugin_id = $plugin_id;

        unset($_REQUEST['md']);
        goto_url('updater.php?md=install&uploaded_zip_file=' . basename($uploadfile) . '&uploaded_plugin_id=' . $plugin_id . '&' . http_build_query($_REQUEST));
    }

    /**
     * installPlugin 
     *
     * 플러그인 설치
     *
     * 설치 프로세스
     *   1. 러블리어스에서 플러그인 파일 다운로드 : <g5>/data/gp/downloaded/<PLUGIN_FILENAME>.zip 에 저장
     *   2. 플러그인 압축 해제 : <g5>/data/gp/downloaded/ 에 압축해제
     *   3. 플러그인 복사 : <g5>/gp/plugins/<PLUGIN_ID> 로 이동
     *   4. 다운로드 데이터 삭제
     * 
     * @access public
     * @return void
     */
    function installPlugin() {
        $this->load_filemanager();

        if (!$this->uploaded_plugin_id || !$this->uploaded_zip_file)
            alert('잘못된 연결');

        $this->uploaded_zip_file = $this->upload_path . DS . $this->uploaded_zip_file;

        $unzipped_dir = $this->upload_path . DS . $this->uploaded_plugin_id;
        $target_dir = GP_PLUGIN_PATH . DS . $this->uploaded_plugin_id;

        if (!file_exists($unzipped_dir))
            alert('업로드된 플러그인이 없습니다.');

        @chmod(G5_DATA_PATH, 0777);
        @chmod(GP_DATA_PATH, 0777);

        if (file_exists($target_dir))
            $this->uninstallPlugin($this->uploaded_plugin_id);

        if (!$this->fs->mkdir($this->_remote_path($target_dir))) {
            $this->_tail();
            alert('디렉토리 생성에 실패하였습니다 : ' . $target_dir, $this->backurl);
        }

        $this->flush('플러그인을 GPF 플러그인 디렉토리로 이동합니다....');
        $res = $this->copy_dir($unzipped_dir, $target_dir);
        if (!$res) {
            $this->error(' [ 실패 ]');
            unlink($this->uploaded_zip_file);
            $this->remove_dir($unzipped_dir);
            $this->_tail();
            return;
        }
        $this->remove_dir($unzipped_dir);
        $this->desc(' [ 완료 ] <br/>');

        unlink($this->uploaded_zip_file); // remove downloaded zip file
        $this->_tail();
    }

    /**
     * uninstallPlugin 
     *
     * 플러그인 삭제
     *
     * 삭제 프로세스
     *   1. '<PLUGIN_ID>_before_removed' 액션 실행
     *   2. 플러그인 삭제 : <g5>/gp/plugins/<PLUGIN_ID> 삭제
     * 
     * @access public
     * @return void
     */
    function uninstallPlugin($plugin_id) {
        $gp_scope = GP_SCOPE_SITE;
        @include_once GP_PLUGIN_PATH . DS . $plugin_id . DS . 'plugin.php';
        gp_do_action($plugin_id . '_before_removed');
        $this->flush('기존에 설치된 플러그인을 제거합니다....');
        $res = $this->fs->delete($this->_remote_path(GP_PLUGIN_PATH . DS . basename($plugin_id)), true);
        if ($res)
            $this->desc(' [ 완료 ] <br/>');
        else
            $this->error(' [ 실패 ] <br/>');
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

        global $plugin;

        @chmod(G5_DATA_PATH, 0707);
        @chmod(GP_DATA_PATH, 0707);
        
        if(!$this->has_error) $this->flush('<br/>플러그인 정보 페이지로 이동합니다... '); 
        
        $msg = '<br/><a href="plugin_install.php?'. gp_uparam(TRUE) . '">플러그인 설치 페이지로 이동</a> | <a href="plugins.php?' . gp_uparam(TRUE) . '">플러그인 목록 페이지로 이동</a>';
        $this->flush($msg);

        if(!$this->has_error) 
        {
            sleep(2);
            goto_url('plugininfo.php?plugin='.$plugin.'&'.  gp_uparam(TRUE));
        }   
    }

}

?>
