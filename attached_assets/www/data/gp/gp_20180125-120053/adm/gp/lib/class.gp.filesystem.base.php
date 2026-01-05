<?php
/**
 * GPF 파일 시스템 베이스 
 *
 * 이 파일은 워드프레스의 WP_Filesystem_Base 의 GPF 버전입니다.
 *
 * @package GPF
 */

/**
 * Base GPF Filesystem class for which Filesystem implementations extend
 */
class GP_Filesystem_Base {

    /**
     * Whether to display debug data for the connection.
     *
     * @access public
     * @var bool
     */
    var $verbose = false;

    /**
     * Cached list of local filepaths to mapped remote filepaths.
     *
     * @access private
     * @var array
     */
    var $cache = array();

    /**
     * The Access method of the current connection, Set automatically.
     *
     * @access public
     * @var string
     */
    var $method = '';

    /**
     * Returns the path on the remote filesystem of ABSPATH
     *
     * @access public
     * @return string The location of the remote path.
     */
    function abspath() {
        $folder = $this->find_folder(GB_PATH);
        if (!$folder && $this->is_dir('/gp'))
            $folder = '/';
        return $folder;
    }

    /**
     * Returns the path on the remote filesystem of GP_PLUGIN_PATH
     *
     * @access public
     * @return string The location of the remote path.
     */
    function plugins_path() {
        return $this->find_folder(GP_PLUGIN_PATH);
    }

    /**
     * Returns the path on the remote filesystem of G5_PATH
     *
     * @access public
     *
     * @return string The location of the remote path.
     */
    function g5_path() {
        return $this->find_folder(G5_PATH);
    }

    /**
     * Returns the path on the remote filesystem of the Themes Directory
     *
     * @access public
     *
     * @return string The location of the remote path.
     */
    function g5_admin_path() {
        return $this->find_folder(G5_ADMIN_PATH);
    }

    /**
     * Returns the path on the remote filesystem of the Themes Directory
     *
     * @access public
     *
     * @return string The location of the remote path.
     */
    function g5_extend_path() {
        return $this->find_folder(G5_PATH) . '/' . G5_EXTEND_DIR;
    }

    /**
     * Returns the path on the remote filesystem of GP_ADMIN_PATH
     *
     * @access public
     *
     * @return string The location of the remote path.
     */
    function gp_admin_path() {
        return $this->find_folder(GP_ADMIN_PATH);
    }

    /**
     * Locates a folder on the remote filesystem.
     *
     * Assumes that on Windows systems, Stripping off the Drive letter is OK
     * Sanitizes \\ to / in windows filepaths.
     *
     * @access public
     *
     * @param string $folder the folder to locate
     * @return string The location of the remote path.
     */
    function find_folder($folder) {

        if ('direct' == $this->method) {
            $folder = str_replace('\\', '/', $folder); //Windows path sanitisation
            return trailingslashit($folder);
        }

        $folder = preg_replace('|^([a-z]{1}):|i', '', $folder); //Strip out windows drive letter if it's there.
        $folder = str_replace('\\', '/', $folder); //Windows path sanitisation

        if (isset($this->cache[$folder]))
            return $this->cache[$folder];

        if ($this->exists($folder)) { //Folder exists at that absolute path.
            $folder = trailingslashit($folder);
            $this->cache[$folder] = $folder;
            return $folder;
        }
        if ($return = $this->search_for_folder($folder))
            $this->cache[$folder] = $return;
        return $return;
    }

    /**
     * Locates a folder on the remote filesystem.
     *
     * Expects Windows sanitized path
     *
     * @access private
     *
     * @param string $folder the folder to locate
     * @param string $base the folder to start searching from
     * @param bool $loop if the function has recursed, Internal use only
     * @return string The location of the remote path.
     */
    function search_for_folder($folder, $base = '.', $loop = false) {
        if (empty($base) || '.' == $base)
            $base = trailingslashit($this->cwd());

        $folder = untrailingslashit($folder);

        $folder_parts = explode('/', $folder);
        $last_index = array_pop(array_keys($folder_parts));
        $last_path = $folder_parts[$last_index];

        $files = $this->dirlist($base);

        foreach ($folder_parts as $index => $key) {
            if ($index == $last_index)
                continue; //We want this to be caught by the next code block.

                
//Working from /home/ to /user/ to /wordpress/ see if that file exists within the current folder,
            // If its found, change into it and follow through looking for it.
            // If it cant find WordPress down that route, it'll continue onto the next folder level, and see if that matches, and so on.
            // If it reaches the end, and still cant find it, it'll return false for the entire function.
            if (isset($files[$key])) {
                //Lets try that folder:
                $newdir = trailingslashit(path_join($base, $key));
                if ($this->verbose)
                    printf('Changing to %s' . '<br/>', $newdir);
                // only search for the remaining path tokens in the directory, not the full path again
                $newfolder = implode('/', array_slice($folder_parts, $index + 1));
                if ($ret = $this->search_for_folder($newfolder, $newdir, $loop))
                    return $ret;
            }
        }

        //Only check this as a last resort, to prevent locating the incorrect install. All above procedures will fail quickly if this is the right branch to take.
        if (isset($files[$last_path])) {
            if ($this->verbose)
                printf('Found %s' . '<br/>', $base . $last_path);
            return trailingslashit($base . $last_path);
        }
        if ($loop)
            return false; //Prevent this function from looping again.
            
//As an extra last resort, Change back to / if the folder wasn't found. This comes into effect when the CWD is /home/user/ but WP is at /var/www/.... mainly dedicated setups.
        return $this->search_for_folder($folder, '/', true);
    }

    /**
     * Returns the *nix style file permissions for a file
     *
     * From the PHP documentation page for fileperms()
     *
     * @link http://docs.php.net/fileperms
     * @access public
     *
     * @param string $file string filename
     * @return int octal representation of permissions
     */
    function gethchmod($file) {
        $perms = $this->getchmod($file);
        if (($perms & 0xC000) == 0xC000) // Socket
            $info = 's';
        elseif (($perms & 0xA000) == 0xA000) // Symbolic Link
            $info = 'l';
        elseif (($perms & 0x8000) == 0x8000) // Regular
            $info = '-';
        elseif (($perms & 0x6000) == 0x6000) // Block special
            $info = 'b';
        elseif (($perms & 0x4000) == 0x4000) // Directory
            $info = 'd';
        elseif (($perms & 0x2000) == 0x2000) // Character special
            $info = 'c';
        elseif (($perms & 0x1000) == 0x1000) // FIFO pipe
            $info = 'p';
        else // Unknown
            $info = 'u';

        // Owner
        $info .= (($perms & 0x0100) ? 'r' : '-');
        $info .= (($perms & 0x0080) ? 'w' : '-');
        $info .= (($perms & 0x0040) ?
                        (($perms & 0x0800) ? 's' : 'x' ) :
                        (($perms & 0x0800) ? 'S' : '-'));

        // Group
        $info .= (($perms & 0x0020) ? 'r' : '-');
        $info .= (($perms & 0x0010) ? 'w' : '-');
        $info .= (($perms & 0x0008) ?
                        (($perms & 0x0400) ? 's' : 'x' ) :
                        (($perms & 0x0400) ? 'S' : '-'));

        // World
        $info .= (($perms & 0x0004) ? 'r' : '-');
        $info .= (($perms & 0x0002) ? 'w' : '-');
        $info .= (($perms & 0x0001) ?
                        (($perms & 0x0200) ? 't' : 'x' ) :
                        (($perms & 0x0200) ? 'T' : '-'));
        return $info;
    }

    /**
     * Converts *nix style file permissions to a octal number.
     *
     * Converts '-rw-r--r--' to 0644
     * From "info at rvgate dot nl"'s comment on the PHP documentation for chmod()
     *
     * @link http://docs.php.net/manual/en/function.chmod.php#49614
     * @access public
     *
     * @param string $mode string *nix style file permission
     * @return int octal representation
     */
    function getnumchmodfromh($mode) {
        $realmode = '';
        $legal = array('', 'w', 'r', 'x', '-');
        $attarray = preg_split('//', $mode);

        for ($i = 0; $i < count($attarray); $i++)
            if ($key = array_search($attarray[$i], $legal))
                $realmode .= $legal[$key];

        $mode = str_pad($realmode, 10, '-', STR_PAD_LEFT);
        $trans = array('-' => '0', 'r' => '4', 'w' => '2', 'x' => '1');
        $mode = strtr($mode, $trans);

        $newmode = $mode[0];
        $newmode .= $mode[1] + $mode[2] + $mode[3];
        $newmode .= $mode[4] + $mode[5] + $mode[6];
        $newmode .= $mode[7] + $mode[8] + $mode[9];
        return $newmode;
    }

    /**
     * Determines if the string provided contains binary characters.
     *
     * @access private
     *
     * @param string $text String to test against
     * @return bool true if string is binary, false otherwise
     */
    function is_binary($text) {
        return (bool) preg_match('|[^\x20-\x7E]|', $text); //chr(32)..chr(127)
    }

}

function trailingslashit($string) {
    return untrailingslashit($string) . '/';
}

function untrailingslashit($string) {
    return rtrim($string, '/');
}

function path_join($base, $path) {
    if (path_is_absolute($path))
        return $path;
    return rtrim($base, '/') . '/' . ltrim($path, '/');
}

function path_is_absolute($path) {
    if (realpath($path) == $path)
        return true;
    if (strlen($path) == 0 || $path[0] == '.')
        return false;
    if (preg_match('#^[a-zA-Z]:\\\\#', $path))
        return true;
    return ( $path[0] == '/' || $path[0] == '\\' );
}
