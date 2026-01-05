<?php
/**
 * 숏코드(ShortCode) 라이브러리 from WordPress
 *
 * 워드프레스(WP)의 Shortcode API 를 그누보드에 사용하기 위해 필요한 기능들만 모은 파일입니다.
 * 혹시 있을 함수명 충돌 방지를 위해 함수명의 prefix 를 gp_ 로 변경하거나 추가했습니다.
 *
 * WP에서는 허용tag 나 attr 등을 filter 기능을 통해 변경 가능하지만,
 * 독립적인 실행을 위해 filter 기능없이 동작하도록 조금 수정하였습니다.
 *
 * GPF 에서 사용할 목적으로 $context 항목을 추가했습니다.
 * $context 는 그누보드의 content 페이지나 게시판 뷰 등을 구분해서 숏코드를 지원하기 위해 사용됩니다.
 *
 * 사용예제 :
 *
 * filename: shortcode_test.php
 * ============================================================
 * <?php
 * include_once GP_PATH."/gp_shortcode.php";
 *
 * // [footag foo="bar"]
 * function footag_func( $atts ) {
 *   return "foo = {$atts[foo]}";
 * }
 * gp_add_shortcode('mypage', 'footag', 'footag_func' );
 *
 * // [bartag foo="bar"]
 * function bartag_func( $atts ) {
 *   $args = gp_shortcode_atts( array(
 *     'foo' => 'no foo',
 *     'baz' => 'default baz',
 *   ), $atts );
 *
 *   return "foo = {$args['foo']}";
 * }
 * gp_add_shortcode('mypage', 'bartag', 'bartag_func' );
 *
 * // [baztag]content[/baztag]
 * function baztag_func( $atts, $content = '' ) {
 *   return "content = $content";
 * }
 * gp_add_shortcode('mypage', 'baztag', 'baztag_func' );
 *
 * $content =<<<EOF
 * <h1>Shortcode API Example</h1>
 * <p>
 * Here is FooTag => [footag foo="bar"] <br/>
 * Here is BarTag => [bartag foo="bar"] <br/>
 * Here is BazTag => [baztag]Baztag content is nothing[/baztag] <br/>
 * </p>
 * EOF;
 *
 * $parsed = gp_do_shortcode('mypage', $content);
 * echo $parsed;
 * ?>
 *
 *
 * Output:
 * ============================================================
 * Shortcod API Example
 *
 * Here is FooTag => foo = { bar }
 * Here is BarTag => foo = bar
 * Here is BazTag => content = Baztag content is nothing
 *
 *
 *
 * @editor Chongmyung Park
 * @license http://www.gnu.org/licenses/gpl.html
 */




class GPShortCodeCallback {
    var $context;
    var $callback_func;

    function __construct($context, $callback_func) {
        $this->context = $context;
        $this->callback_func = $callback_func;
    }

    function callback($matches) {
        return call_user_func_array($this->callback_func, array($this->context, $matches));
    }
}


/**
 * WordPress API for creating bbcode like tags or what WordPress calls
 * "shortcodes." The tag and attribute parsing or regular expression code is
 * based on the Textpattern tag parser.
 *
 * A few examples are below:
 *
 * [shortcode /]
 * [shortcode foo="bar" baz="bing" /]
 * [shortcode foo="bar"]content[/shortcode]
 *
 * Shortcode tags support attributes and enclosed content, but does not entirely
 * support inline shortcodes in other shortcodes. You will have to call the
 * shortcode parser in your function to account for that.
 *
 * {@internal
 * Please be aware that the above note was made during the beta of WordPress 2.6
 * and in the future may not be accurate. Please update the note when it is no
 * longer the case.}}
 *
 * To apply shortcode tags to content:
 *
 *     $out = do_shortcode( $content );
 *
 * @link https://codex.wordpress.org/Shortcode_API
 *
 * @package WordPress
 * @subpackage Shortcodes
 * @since 2.5.0
 */



/**
 * Container for storing shortcode tags and their hook to call for the shortcode
 *
 * @since 2.5.0
 *
 * @name $shortcode_tags
 * @var array
 * @global array $shortcode_tags
 */
$shortcode_tags = array();

/**
 * Add hook for shortcode tag.
 *
 * There can only be one hook for each shortcode. Which means that if another
 * plugin has a similar shortcode, it will override yours or yours will override
 * theirs depending on which order the plugins are included and/or ran.
 *
 * Simplest example of a shortcode tag using the API:
 *
 *     // [footag foo="bar"]
 *     function footag_func( $atts ) {
 *         return "foo = {
 *             $atts[foo]
 *         }";
 *     }
 *     add_shortcode( 'footag', 'footag_func' );
 *
 * Example with nice attribute defaults:
 *
 *     // [bartag foo="bar"]
 *     function bartag_func( $atts ) {
 *         $args = shortcode_atts( array(
 *             'foo' => 'no foo',
 *             'baz' => 'default baz',
 *         ), $atts );
 *
 *         return "foo = {$args['foo']}";
 *     }
 *     add_shortcode( 'bartag', 'bartag_func' );
 *
 * Example with enclosed content:
 *
 *     // [baztag]content[/baztag]
 *     function baztag_func( $atts, $content = '' ) {
 *         return "content = $content";
 *     }
 *     add_shortcode( 'baztag', 'baztag_func' );
 *
 * @since 2.5.0
 *
 * @uses $shortcode_tags
 *
 * @param string $context
 * @param string $tag Shortcode tag to be searched in post content.
 * @param callable $func Hook to run when shortcode is found.
 */
function gp_add_shortcode($context, $tag, $func) {
    global $shortcode_tags;

    if ( is_callable($func) ) {
        if(!isset($shortcode_tags[$context])) $shortcode_tags[$context] = array();
        $shortcode_tags[$context][$tag] = $func;
    }
}

/**
 * Removes hook for shortcode.
 *
 * @since 2.5.0
 *
 * @uses $shortcode_tags
 *
 * @param string $context
 * @param string $tag Shortcode tag to remove hook for.
 */
function gp_remove_shortcode($context, $tag) {
    global $shortcode_tags;

    if(array_key_exists($context, $shortcode_tags))
        unset($shortcode_tags[$context][$tag]);
}

/**
 * Clear all shortcodes.
 *
 * This function is simple, it clears all of the shortcode tags by replacing the
 * shortcodes global by a empty array. This is actually a very efficient method
 * for removing all shortcodes.
 *
 * @since 2.5.0
 *
 * @uses $shortcode_tags
 */
function gp_remove_all_shortcodes() {
    global $shortcode_tags;

    $shortcode_tags = array();
}

/**
 * Whether a registered shortcode exists named $tag
 *
 * @since 3.6.0
 *
 * @global array $shortcode_tags List of shortcode tags and their callback hooks.
 *
 * @param string $context
 * @param string $tag Shortcode tag to check.
 * @return bool Whether the given shortcode exists.
 */
function gp_shortcode_exists($context, $tag ) {
    global $shortcode_tags;
    return array_key_exists( $context, $shortcode_tags ) && array_key_exists( $tag, $shortcode_tags[$context] );
}

/**
 * Whether the passed content contains the specified shortcode
 *
 * @since 3.6.0
 *
 * @global array $shortcode_tags
 *
 * @param string $content Content to search for shortcodes.
 * @param string $tag     Shortcode tag to check.
 * @return bool Whether the passed content contains the given shortcode.
 */
function gp_has_shortcode($context, $content, $tag ) {
    if ( false === strpos( $content, '[' ) ) {
        return false;
    }

    if ( gp_shortcode_exists($context, $tag ) ) {
        preg_match_all( '/' . gp_get_shortcode_regex($context) . '/s', $content, $matches, PREG_SET_ORDER );
        if ( empty( $matches ) )
            return false;

        foreach ( $matches as $shortcode ) {
            if ( $tag === $shortcode[2] ) {
                return true;
            } elseif ( ! empty( $shortcode[5] ) && gp_has_shortcode($context, $shortcode[5], $tag ) ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Search content for shortcodes and filter shortcodes through their hooks.
 *
 * If there are no shortcode tags defined, then the content will be returned
 * without any filtering. This might cause issues when plugins are disabled but
 * the shortcode will still show up in the post or content.
 *
 * @since 2.5.0
 *
 * @global array $shortcode_tags List of shortcode tags and their callback hooks.
 *
 * @param string $context
 * @param string $content Content to search for shortcodes.
 * @param bool $ignore_html When true, shortcodes inside HTML elements will be skipped.
 * @return string Content with shortcodes filtered out.
 */
function gp_do_shortcode($context, $content, $ignore_html = false ) {
    global $shortcode_tags;

    if ( false === strpos( $content, '[' ) ) {
        return $content;
    }

    if (empty($shortcode_tags) || !is_array($shortcode_tags))
        return $content;

    if(!array_key_exists($context, $shortcode_tags))
        return $content;

    $gp_callback = new GPShortCodeCallback($context, 'gp_do_shortcode_tag');
    $tagnames = array_keys($shortcode_tags[$context]);
    $tagregexp = join( '|', array_map('preg_quote', $tagnames) );
    $pattern = "/\\[($tagregexp)/s";

    if ( 1 !== preg_match( $pattern, $content ) ) {
        // Avoids parsing HTML when there are no shortcodes or embeds anyway.
        return $content;
    }

    $content = gp_do_shortcodes_in_html_tags($context, $content, $ignore_html );

    $pattern = gp_get_shortcode_regex($context);
    $content = preg_replace_callback( "/$pattern/s", array($gp_callback, 'callback'), $content );

    // Always restore square braces so we don't break things like <!--[if IE ]>
    $content = gp_unescape_invalid_shortcodes( $content );

    return $content;
}

/**
 * Retrieve the shortcode regular expression for searching.
 *
 * The regular expression combines the shortcode tags in the regular expression
 * in a regex class.
 *
 * The regular expression contains 6 different sub matches to help with parsing.
 *
 * 1 - An extra [ to allow for escaping shortcodes with double [[]]
 * 2 - The shortcode name
 * 3 - The shortcode argument list
 * 4 - The self closing /
 * 5 - The content of a shortcode when it wraps some content.
 * 6 - An extra ] to allow for escaping shortcodes with double [[]]
 *
 * @since 2.5.0
 *
 * @uses $shortcode_tags
 *
 * @return string The shortcode search regular expression
 */
function gp_get_shortcode_regex($context) {
    global $shortcode_tags;
    if(!isset($shortcode_tags[$context])) $shortcode_tags[$context] = array();
    $tagnames = array_keys($shortcode_tags[$context]);
    $tagregexp = join( '|', array_map('preg_quote', $tagnames) );

    // WARNING! Do not change this regex without changing do_shortcode_tag() and strip_shortcode_tag()
    // Also, see shortcode_unautop() and shortcode.js.
    return
        '\\['                              // Opening bracket
        . '(\\[?)'                           // 1: Optional second opening bracket for escaping shortcodes: [[tag]]
        . "($tagregexp)"                     // 2: Shortcode name
        . '(?![\\w-])'                       // Not followed by word character or hyphen
        . '('                                // 3: Unroll the loop: Inside the opening shortcode tag
        .     '[^\\]\\/]*'                   // Not a closing bracket or forward slash
        .     '(?:'
        .         '\\/(?!\\])'               // A forward slash not followed by a closing bracket
        .         '[^\\]\\/]*'               // Not a closing bracket or forward slash
        .     ')*?'
        . ')'
        . '(?:'
        .     '(\\/)'                        // 4: Self closing tag ...
        .     '\\]'                          // ... and closing bracket
        . '|'
        .     '\\]'                          // Closing bracket
        .     '(?:'
        .         '('                        // 5: Unroll the loop: Optionally, anything between the opening and closing shortcode tags
        .             '[^\\[]*+'             // Not an opening bracket
        .             '(?:'
        .                 '\\[(?!\\/\\2\\])' // An opening bracket not followed by the closing shortcode tag
        .                 '[^\\[]*+'         // Not an opening bracket
        .             ')*+'
        .         ')'
        .         '\\[\\/\\2\\]'             // Closing shortcode tag
        .     ')?'
        . ')'
        . '(\\]?)';                          // 6: Optional second closing brocket for escaping shortcodes: [[tag]]
}

/**
 * Regular Expression callable for do_shortcode() for calling shortcode hook.
 * @see gp_get_shortcode_regex for details of the match array contents.
 *
 * @since 2.5.0
 * @access private
 * @uses $shortcode_tags
 *
 * @param string $context
 * @param array $m Regular expression match array
 * @return mixed False on failure.
 */
function gp_do_shortcode_tag($context, $m ) {
    global $shortcode_tags;

    // allow [[foo]] syntax for escaping a tag
    if ( $m[1] == '[' && $m[6] == ']' ) {
        return substr($m[0], 1, -1);
    }

    $tag = $m[2];
    $attr = gp_shortcode_parse_atts( $m[3] );

    if ( isset( $m[5] ) ) {
        // enclosing tag - extra parameter
        return $m[1] . call_user_func( $shortcode_tags[$context][$tag], $attr, $m[5], $tag ) . $m[6];
    } else {
        // self-closing tag
        return $m[1] . call_user_func( $shortcode_tags[$context][$tag], $attr, null,  $tag ) . $m[6];
    }
}

/**
 * Search only inside HTML elements for shortcodes and process them.
 *
 * Any [ or ] characters remaining inside elements will be HTML encoded
 * to prevent interference with shortcodes that are outside the elements.
 * Assumes $content processed by KSES already.  Users with unfiltered_html
 * capability may get unexpected output if angle braces are nested in tags.
 *
 * @since 4.2.3
 *
 * @param string $context
 * @param string $content Content to search for shortcodes
 * @param bool $ignore_html When true, all square braces inside elements will be encoded.
 * @return string Content with shortcodes filtered out.
 */
function gp_do_shortcodes_in_html_tags($context, $content, $ignore_html ) {
    // Normalize entities in unfiltered HTML before adding placeholders.
    $trans = array( '&#91;' => '&#091;', '&#93;' => '&#093;' );
    $content = strtr( $content, $trans );
    $trans = array( '[' => '&#91;', ']' => '&#93;' );

    $gp_callback = new GPShortCodeCallback($context, 'gp_do_shortcode_tag');
    $pattern = gp_get_shortcode_regex($context);
    $textarr = gp_html_split( $content );

    foreach ( $textarr as &$element ) {
        if ( '' == $element || '<' !== $element[0] ) {
            continue;
        }

        $noopen = false === strpos( $element, '[' );
        $noclose = false === strpos( $element, ']' );
        if ( $noopen || $noclose ) {
            // This element does not contain shortcodes.
            if ( $noopen xor $noclose ) {
                // Need to encode stray [ or ] chars.
                $element = strtr( $element, $trans );
            }
            continue;
        }

        if ( $ignore_html || '<!--' === substr( $element, 0, 4 ) || '<![CDATA[' === substr( $element, 0, 9 ) ) {
            // Encode all [ and ] chars.
            $element = strtr( $element, $trans );
            continue;
        }

        $attributes = gp_kses_attr_parse( $element );
        if ( false === $attributes ) {
            // Some plugins are doing things like [name] <[email]>.
            if ( 1 === preg_match( '%^<\s*\[\[?[^\[\]]+\]%', $element ) ) {
                $element = preg_replace_callback( "/$pattern/s", array($gp_callback, 'callback'), $element );
            }

            // Looks like we found some crazy unfiltered HTML.  Skipping it for sanity.
            $element = strtr( $element, $trans );
            continue;
        }

        // Get element name
        $front = array_shift( $attributes );
        $back = array_pop( $attributes );
        $matches = array();
        preg_match('%[a-zA-Z0-9]+%', $front, $matches);
        $elname = $matches[0];

        // Look for shortcodes in each attribute separately.
        foreach ( $attributes as &$attr ) {
            $open = strpos( $attr, '[' );
            $close = strpos( $attr, ']' );
            if ( false === $open || false === $close ) {
                continue; // Go to next attribute.  Square braces will be escaped at end of loop.
            }
            $double = strpos( $attr, '"' );
            $single = strpos( $attr, "'" );
            if ( ( false === $single || $open < $single ) && ( false === $double || $open < $double ) ) {
                // $attr like '[shortcode]' or 'name = [shortcode]' implies unfiltered_html.
                // In this specific situation we assume KSES did not run because the input
                // was written by an administrator, so we should avoid changing the output
                // and we do not need to run KSES here.
                $attr = preg_replace_callback( "/$pattern/s", array($gp_callback, 'callback'), $attr );
            } else {
                // $attr like 'name = "[shortcode]"' or "name = '[shortcode]'"
                // We do not know if $content was unfiltered. Assume KSES ran before shortcodes.
                $count = 0;
                $new_attr = preg_replace_callback( "/$pattern/s", array($gp_callback, 'callback'), $attr, -1, $count );
                if ( $count > 0 ) {
                    // Sanitize the shortcode output using KSES.
                    $new_attr = gp_kses_one_attr( $new_attr, $elname );
                    if ( '' !== $new_attr ) {
                        // The shortcode is safe to use now.
                        $attr = $new_attr;
                    }
                }
            }
        }
        $element = $front . implode( '', $attributes ) . $back;

        // Now encode any remaining [ or ] chars.
        $element = strtr( $element, $trans );
    }

    $content = implode( '', $textarr );

    return $content;
}

/**
 * Remove placeholders added by do_shortcodes_in_html_tags().
 *
 * @since 4.2.3
 *
 * @param string $content Content to search for placeholders.
 * @return string Content with placeholders removed.
 */
function gp_unescape_invalid_shortcodes( $content ) {
    // Clean up entire string, avoids re-parsing HTML.
    $trans = array( '&#91;' => '[', '&#93;' => ']' );
    $content = strtr( $content, $trans );

    return $content;
}

/**
 * Retrieve all attributes from the shortcodes tag.
 *
 * The attributes list has the attribute name as the key and the value of the
 * attribute as the value in the key/value pair. This allows for easier
 * retrieval of the attributes, since all attributes have to be known.
 *
 * @since 2.5.0
 *
 * @param string $text
 * @return array List of attributes and their value.
 */
function gp_shortcode_parse_atts($text) {
    $atts = array();
    $pattern = '/(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/';
    $text = preg_replace("/[\x{00a0}\x{200b}]+/u", " ", $text);
    if ( preg_match_all($pattern, $text, $match, PREG_SET_ORDER) ) {
        foreach ($match as $m) {
            if (!empty($m[1]))
                $atts[strtolower($m[1])] = stripcslashes($m[2]);
            elseif (!empty($m[3]))
                $atts[strtolower($m[3])] = stripcslashes($m[4]);
            elseif (!empty($m[5]))
                $atts[strtolower($m[5])] = stripcslashes($m[6]);
            elseif (isset($m[7]) && strlen($m[7]))
                $atts[] = stripcslashes($m[7]);
            elseif (isset($m[8]))
                $atts[] = stripcslashes($m[8]);
        }
    } else {
        $atts = ltrim($text);
    }
    return $atts;
}

/**
 * Combine user attributes with known attributes and fill in defaults when needed.
 *
 * The pairs should be considered to be all of the attributes which are
 * supported by the caller and given as a list. The returned attributes will
 * only contain the attributes in the $pairs list.
 *
 * If the $atts list has unsupported attributes, then they will be ignored and
 * removed from the final returned list.
 *
 * @since 2.5.0
 *
 * @param array $pairs Entire list of supported attributes and their defaults.
 * @param array $atts User defined attributes in shortcode tag.
 * @param string $shortcode Optional. The name of the shortcode, provided for context to enable filtering
 * @return array Combined and filtered attribute list.
 */
function gp_shortcode_atts( $pairs, $atts, $shortcode = '' ) {
    $atts = (array)$atts;
    $out = array();
    foreach($pairs as $name => $default) {
        if ( array_key_exists($name, $atts) )
            $out[$name] = $atts[$name];
        else
            $out[$name] = $default;
    }

    return $out;
}

/**
 * Remove all shortcode tags from the given content.
 *
 * @since 2.5.0
 *
 * @uses $shortcode_tags
 *
 * @param string $context
 * @param string $content Content to remove shortcode tags.
 * @return string Content without shortcode tags.
 */
function gp_strip_shortcodes($context, $content ) {
    global $shortcode_tags;

    if ( false === strpos( $content, '[' ) ) {
        return $content;
    }

    if (empty($shortcode_tags) || !is_array($shortcode_tags))
        return $content;

    $content = gp_do_shortcodes_in_html_tags($context, $content, true );

    $pattern = gp_get_shortcode_regex($context);
    $content = preg_replace_callback( "/$pattern/s", 'gp_strip_shortcode_tag', $content );

    // Always restore square braces so we don't break things like <!--[if IE ]>
    $content = gp_unescape_invalid_shortcodes( $content );

    return $content;
}

function gp_strip_shortcode_tag( $m ) {
    // allow [[foo]] syntax for escaping a tag
    if ( $m[1] == '[' && $m[6] == ']' ) {
        return substr($m[0], 1, -1);
    }

    return $m[1] . $m[6];
}


#################

/**
 * Separate HTML elements and comments from the text.
 *
 * @since 4.2.4
 *
 * @param string $input The text which has to be formatted.
 * @return array The formatted text.
 */
function gp_html_split( $input ) {
    static $regex;

    if ( ! isset( $regex ) ) {
        $comments =
            '!'           // Start of comment, after the <.
            . '(?:'         // Unroll the loop: Consume everything until --> is found.
            .     '-(?!->)' // Dash not followed by end of comment.
            .     '[^\-]*+' // Consume non-dashes.
            . ')*+'         // Loop possessively.
            . '(?:-->)?';   // End of comment. If not found, match all input.

        $cdata =
            '!\[CDATA\['  // Start of comment, after the <.
            . '[^\]]*+'     // Consume non-].
            . '(?:'         // Unroll the loop: Consume everything until ]]> is found.
            .     '](?!]>)' // One ] not followed by end of comment.
            .     '[^\]]*+' // Consume non-].
            . ')*+'         // Loop possessively.
            . '(?:]]>)?';   // End of comment. If not found, match all input.

        $regex =
            '/('              // Capture the entire match.
            .     '<'           // Find start of element.
            .     '(?(?=!--)'   // Is this a comment?
            .         $comments // Find end of comment.
            .     '|'
            .         '(?(?=!\[CDATA\[)' // Is this a comment?
            .             $cdata // Find end of comment.
            .         '|'
            .             '[^>]*>?' // Find end of element. If not found, match all input.
            .         ')'
            .     ')'
            . ')/s';
    }

    return preg_split( $regex, $input, -1, PREG_SPLIT_DELIM_CAPTURE );
}

/**
 * Finds all attributes of an HTML element.
 *
 * Does not modify input.  May return "evil" output.
 *
 * Based on wp_kses_split2() and wp_kses_attr()
 *
 * @since 4.2.3
 *
 * @param string $element HTML element/tag
 * @return array|bool List of attributes found in $element. Returns false on failure.
 */
function gp_kses_attr_parse( $element ) {
    $valid = preg_match('%^(<\s*)(/\s*)?([a-zA-Z0-9]+\s*)([^>]*)(>?)$%', $element, $matches);
    if ( 1 !== $valid ) {
        return false;
    }

    $begin =  $matches[1];
    $slash =  $matches[2];
    $elname = $matches[3];
    $attr =   $matches[4];
    $end =    $matches[5];

    if ( '' !== $slash ) {
        // Closing elements do not get parsed.
        return false;
    }

    // Is there a closing XHTML slash at the end of the attributes?
    if ( 1 === preg_match( '%\s*/\s*$%', $attr, $matches ) ) {
        $xhtml_slash = $matches[0];
        $attr = substr( $attr, 0, -strlen( $xhtml_slash ) );
    } else {
        $xhtml_slash = '';
    }

    // Split it
    $attrarr = gp_kses_hair_parse( $attr );
    if ( false === $attrarr ) {
        return false;
    }

    // Make sure all input is returned by adding front and back matter.
    array_unshift( $attrarr, $begin . $slash . $elname );
    array_push( $attrarr, $xhtml_slash . $end );

    return $attrarr;
}


/**
 * Builds an attribute list from string containing attributes.
 *
 * Does not modify input.  May return "evil" output.
 * In case of unexpected input, returns false instead of stripping things.
 *
 * Based on wp_kses_hair() but does not return a multi-dimensional array.
 *
 * @since 4.2.3
 *
 * @param string $attr Attribute list from HTML element to closing HTML element tag
 * @return array|bool List of attributes found in $attr. Returns false on failure.
 */
function gp_kses_hair_parse( $attr ) {
    if ( '' === $attr ) {
        return array();
    }

    $regex =
        '(?:'
        .     '[-a-zA-Z:]+'   // Attribute name.
        . '|'
        .     '\[\[?[^\[\]]+\]\]?' // Shortcode in the name position implies unfiltered_html.
        . ')'
        . '(?:'               // Attribute value.
        .     '\s*=\s*'       // All values begin with '='
        .     '(?:'
        .         '"[^"]*"'   // Double-quoted
        .     '|'
        .         "'[^']*'"   // Single-quoted
        .     '|'
        .         '[^\s"\']+' // Non-quoted
        .         '(?:\s|$)'  // Must have a space
        .     ')'
        . '|'
        .     '(?:\s|$)'      // If attribute has no value, space is required.
        . ')'
        . '\s*';              // Trailing space is optional except as mentioned above.

    // Although it is possible to reduce this procedure to a single regexp,
    // we must run that regexp twice to get exactly the expected result.

    $validation = "%^($regex)+$%";
    $extraction = "%$regex%";

    if ( 1 === preg_match( $validation, $attr ) ) {
        preg_match_all( $extraction, $attr, $attrarr );
        return $attrarr[0];
    } else {
        return false;
    }
}

/**
 * Filters one attribute only and ensures its value is allowed.
 *
 * This function has the advantage of being more secure than esc_attr() and can
 * escape data in some situations where wp_kses() must strip the whole attribute.
 *
 * @since 4.2.3
 *
 * @param string $string The 'whole' attribute, including name and value.
 * @param string $element The element name to which the attribute belongs.
 * @return string Filtered attribute.
 */
function gp_kses_one_attr( $string, $element ) {
    $allowed_html = array(
        'address' => array(),
        'a' => array(
            'href' => true,
            'rel' => true,
            'rev' => true,
            'name' => true,
            'target' => true,
        ),
        'abbr' => array(),
        'acronym' => array(),
        'area' => array(
            'alt' => true,
            'coords' => true,
            'href' => true,
            'nohref' => true,
            'shape' => true,
            'target' => true,
        ),
        'article' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'aside' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'audio' => array(
            'autoplay' => true,
            'controls' => true,
            'loop' => true,
            'muted' => true,
            'preload' => true,
            'src' => true,
        ),
        'b' => array(),
        'big' => array(),
        'blockquote' => array(
            'cite' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'br' => array(),
        'button' => array(
            'disabled' => true,
            'name' => true,
            'type' => true,
            'value' => true,
        ),
        'caption' => array(
            'align' => true,
        ),
        'cite' => array(
            'dir' => true,
            'lang' => true,
        ),
        'code' => array(),
        'col' => array(
            'align' => true,
            'char' => true,
            'charoff' => true,
            'span' => true,
            'dir' => true,
            'valign' => true,
            'width' => true,
        ),
        'colgroup' => array(
            'align' => true,
            'char' => true,
            'charoff' => true,
            'span' => true,
            'valign' => true,
            'width' => true,
        ),
        'del' => array(
            'datetime' => true,
        ),
        'dd' => array(),
        'dfn' => array(),
        'details' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'open' => true,
            'xml:lang' => true,
        ),
        'div' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'dl' => array(),
        'dt' => array(),
        'em' => array(),
        'fieldset' => array(),
        'figure' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'figcaption' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'font' => array(
            'color' => true,
            'face' => true,
            'size' => true,
        ),
        'footer' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'form' => array(
            'action' => true,
            'accept' => true,
            'accept-charset' => true,
            'enctype' => true,
            'method' => true,
            'name' => true,
            'target' => true,
        ),
        'h1' => array(
            'align' => true,
        ),
        'h2' => array(
            'align' => true,
        ),
        'h3' => array(
            'align' => true,
        ),
        'h4' => array(
            'align' => true,
        ),
        'h5' => array(
            'align' => true,
        ),
        'h6' => array(
            'align' => true,
        ),
        'header' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'hgroup' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'hr' => array(
            'align' => true,
            'noshade' => true,
            'size' => true,
            'width' => true,
        ),
        'i' => array(),
        'img' => array(
            'alt' => true,
            'align' => true,
            'border' => true,
            'height' => true,
            'hspace' => true,
            'longdesc' => true,
            'vspace' => true,
            'src' => true,
            'usemap' => true,
            'width' => true,
        ),
        'ins' => array(
            'datetime' => true,
            'cite' => true,
        ),
        'kbd' => array(),
        'label' => array(
            'for' => true,
        ),
        'legend' => array(
            'align' => true,
        ),
        'li' => array(
            'align' => true,
            'value' => true,
        ),
        'map' => array(
            'name' => true,
        ),
        'mark' => array(),
        'menu' => array(
            'type' => true,
        ),
        'nav' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'p' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'pre' => array(
            'width' => true,
        ),
        'q' => array(
            'cite' => true,
        ),
        's' => array(),
        'samp' => array(),
        'span' => array(
            'dir' => true,
            'align' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'section' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'small' => array(),
        'strike' => array(),
        'strong' => array(),
        'sub' => array(),
        'summary' => array(
            'align' => true,
            'dir' => true,
            'lang' => true,
            'xml:lang' => true,
        ),
        'sup' => array(),
        'table' => array(
            'align' => true,
            'bgcolor' => true,
            'border' => true,
            'cellpadding' => true,
            'cellspacing' => true,
            'dir' => true,
            'rules' => true,
            'summary' => true,
            'width' => true,
        ),
        'tbody' => array(
            'align' => true,
            'char' => true,
            'charoff' => true,
            'valign' => true,
        ),
        'td' => array(
            'abbr' => true,
            'align' => true,
            'axis' => true,
            'bgcolor' => true,
            'char' => true,
            'charoff' => true,
            'colspan' => true,
            'dir' => true,
            'headers' => true,
            'height' => true,
            'nowrap' => true,
            'rowspan' => true,
            'scope' => true,
            'valign' => true,
            'width' => true,
        ),
        'textarea' => array(
            'cols' => true,
            'rows' => true,
            'disabled' => true,
            'name' => true,
            'readonly' => true,
        ),
        'tfoot' => array(
            'align' => true,
            'char' => true,
            'charoff' => true,
            'valign' => true,
        ),
        'th' => array(
            'abbr' => true,
            'align' => true,
            'axis' => true,
            'bgcolor' => true,
            'char' => true,
            'charoff' => true,
            'colspan' => true,
            'headers' => true,
            'height' => true,
            'nowrap' => true,
            'rowspan' => true,
            'scope' => true,
            'valign' => true,
            'width' => true,
        ),
        'thead' => array(
            'align' => true,
            'char' => true,
            'charoff' => true,
            'valign' => true,
        ),
        'title' => array(),
        'tr' => array(
            'align' => true,
            'bgcolor' => true,
            'char' => true,
            'charoff' => true,
            'valign' => true,
        ),
        'track' => array(
            'default' => true,
            'kind' => true,
            'label' => true,
            'src' => true,
            'srclang' => true,
        ),
        'tt' => array(),
        'u' => array(),
        'ul' => array(
            'type' => true,
        ),
        'ol' => array(
            'start' => true,
            'type' => true,
        ),
        'var' => array(),
        'video' => array(
            'autoplay' => true,
            'controls' => true,
            'height' => true,
            'loop' => true,
            'muted' => true,
            'poster' => true,
            'preload' => true,
            'src' => true,
            'width' => true,
        ),
    );
    $uris = array('xmlns', 'profile', 'href', 'src', 'cite', 'classid', 'codebase', 'data', 'usemap', 'longdesc', 'action');
    $allowed_protocols = array( 'http', 'https');
    $string = gp_kses_no_null( $string, array( 'slash_zero' => 'keep' ) );
    $string = gp_kses_js_entities( $string );
    $string = gp_kses_normalize_entities( $string );

    // Preserve leading and trailing whitespace.
    $matches = array();
    preg_match('/^\s*/', $string, $matches);
    $lead = $matches[0];
    preg_match('/\s*$/', $string, $matches);
    $trail = $matches[0];
    if ( empty( $trail ) ) {
        $string = substr( $string, strlen( $lead ) );
    } else {
        $string = substr( $string, strlen( $lead ), -strlen( $trail ) );
    }

    // Parse attribute name and value from input.
    $split = preg_split( '/\s*=\s*/', $string, 2 );
    $name = $split[0];
    if ( count( $split ) == 2 ) {
        $value = $split[1];

        // Remove quotes surrounding $value.
        // Also guarantee correct quoting in $string for this one attribute.
        if ( '' == $value ) {
            $quote = '';
        } else {
            $quote = $value[0];
        }
        if ( '"' == $quote || "'" == $quote ) {
            if ( substr( $value, -1 ) != $quote ) {
                return '';
            }
            $value = substr( $value, 1, -1 );
        } else {
            $quote = '"';
        }

        // Sanitize quotes and angle braces.
        $value = htmlspecialchars( $value, ENT_QUOTES, null, false );

        // Sanitize URI values.
        if ( in_array( strtolower( $name ), $uris ) ) {
            $value = gp_kses_bad_protocol( $value, $allowed_protocols );
        }

        $string = "$name=$quote$value$quote";
        $vless = 'n';
    } else {
        $value = '';
        $vless = 'y';
    }

    // Sanitize attribute by name.
    gp_kses_attr_check( $name, $value, $string, $vless, $element, $allowed_html );

    // Restore whitespace.
    return $lead . $string . $trail;
}


/**
 * Removes any invalid control characters in $string.
 *
 * Also removes any instance of the '\0' string.
 *
 * @since 1.0.0
 *
 * @param string $string
 * @return string
 */
function gp_kses_no_null($string) {
    $string = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $string);
    $string = preg_replace('/(\\\\0)+/', '', $string);

    return $string;
}

/**
 * Removes the HTML JavaScript entities found in early versions of Netscape 4.
 *
 * @since 1.0.0
 *
 * @param string $string
 * @return string
 */
function gp_kses_js_entities($string) {
    return preg_replace('%&\s*\{[^}]*(\}\s*;?|$)%', '', $string);
}

/**
 * Converts and fixes HTML entities.
 *
 * This function normalizes HTML entities. It will convert `AT&T` to the correct
 * `AT&amp;T`, `&#00058;` to `&#58;`, `&#XYZZY;` to `&amp;#XYZZY;` and so on.
 *
 * @since 1.0.0
 *
 * @param string $string Content to normalize entities
 * @return string Content with normalized entities
 */
function gp_kses_normalize_entities($string) {
    // Disarm all entities by converting & to &amp;

    $string = str_replace('&', '&amp;', $string);

    // Change back the allowed entities in our entity whitelist

    $string = preg_replace_callback('/&amp;([A-Za-z]{2,8}[0-9]{0,2});/', 'wp_kses_named_entities', $string);
    $string = preg_replace_callback('/&amp;#(0*[0-9]{1,7});/', 'wp_kses_normalize_entities2', $string);
    $string = preg_replace_callback('/&amp;#[Xx](0*[0-9A-Fa-f]{1,6});/', 'wp_kses_normalize_entities3', $string);

    return $string;
}

/**
 * Sanitize string from bad protocols.
 *
 * This function removes all non-allowed protocols from the beginning of
 * $string. It ignores whitespace and the case of the letters, and it does
 * understand HTML entities. It does its work in a while loop, so it won't be
 * fooled by a string like "javascript:javascript:alert(57)".
 *
 * @since 1.0.0
 *
 * @param string $string Content to filter bad protocols from
 * @param array $allowed_protocols Allowed protocols to keep
 * @return string Filtered content
 */
function gp_kses_bad_protocol($string, $allowed_protocols) {
    $string = gp_kses_no_null($string);
    $iterations = 0;

    do {
        $original_string = $string;
        $string = gp_kses_bad_protocol_once($string, $allowed_protocols);
    } while ( $original_string != $string && ++$iterations < 6 );

    if ( $original_string != $string )
        return '';

    return $string;
}


/**
 * Sanitizes content from bad protocols and other characters.
 *
 * This function searches for URL protocols at the beginning of $string, while
 * handling whitespace and HTML entities.
 *
 * @since 1.0.0
 *
 * @param string $string Content to check for bad protocols
 * @param string $allowed_protocols Allowed protocols
 * @return string Sanitized content
 */
function gp_kses_bad_protocol_once($string, $allowed_protocols, $count = 1 ) {
    $string2 = preg_split( '/:|&#0*58;|&#x0*3a;/i', $string, 2 );
    if ( isset($string2[1]) && ! preg_match('%/\?%', $string2[0]) ) {
        $string = trim( $string2[1] );
        $protocol = gp_kses_bad_protocol_once2( $string2[0], $allowed_protocols );
        if ( 'feed:' == $protocol ) {
            if ( $count > 2 )
                return '';
            $string = gp_kses_bad_protocol_once( $string, $allowed_protocols, ++$count );
            if ( empty( $string ) )
                return $string;
        }
        $string = $protocol . $string;
    }

    return $string;
}

/**
 * Callback for wp_kses_bad_protocol_once() regular expression.
 *
 * This function processes URL protocols, checks to see if they're in the
 * whitelist or not, and returns different data depending on the answer.
 *
 * @access private
 * @since 1.0.0
 *
 * @param string $string URI scheme to check against the whitelist
 * @param string $allowed_protocols Allowed protocols
 * @return string Sanitized content
 */
function gp_kses_bad_protocol_once2( $string, $allowed_protocols ) {
    $string2 = gp_kses_decode_entities($string);
    $string2 = preg_replace('/\s/', '', $string2);
    $string2 = gp_kses_no_null($string2);
    $string2 = strtolower($string2);

    $allowed = false;
    foreach ( (array) $allowed_protocols as $one_protocol )
        if ( strtolower($one_protocol) == $string2 ) {
            $allowed = true;
            break;
        }

    if ($allowed)
        return "$string2:";
    else
        return '';
}

/**
 * Convert all entities to their character counterparts.
 *
 * This function decodes numeric HTML entities (`&#65;` and `&#x41;`).
 * It doesn't do anything with other entities like &auml;, but we don't
 * need them in the URL protocol whitelisting system anyway.
 *
 * @since 1.0.0
 *
 * @param string $string Content to change entities
 * @return string Content after decoded entities
 */
function gp_kses_decode_entities($string) {
    $string = preg_replace_callback('/&#([0-9]+);/', '_wp_kses_decode_entities_chr', $string);
    $string = preg_replace_callback('/&#[Xx]([0-9A-Fa-f]+);/', '_wp_kses_decode_entities_chr_hexdec', $string);

    return $string;
}


/**
 * Determine whether an attribute is allowed.
 *
 * @since 4.2.3
 *
 * @param string $name The attribute name. Returns empty string when not allowed.
 * @param string $value The attribute value. Returns a filtered value.
 * @param string $whole The name=value input. Returns filtered input.
 * @param string $vless 'y' when attribute like "enabled", otherwise 'n'.
 * @param string $element The name of the element to which this attribute belongs.
 * @param array $allowed_html The full list of allowed elements and attributes.
 * @return bool Is the attribute allowed?
 */
function gp_kses_attr_check( &$name, &$value, &$whole, $vless, $element, $allowed_html ) {
    $allowed_attr = $allowed_html[strtolower( $element )];

    $name_low = strtolower( $name );
    if ( ! isset( $allowed_attr[$name_low] ) || '' == $allowed_attr[$name_low] ) {
        $name = $value = $whole = '';
        return false;
    }

    if ( 'style' == $name_low ) {
        $new_value = gp_safecss_filter_attr( $value );

        if ( empty( $new_value ) ) {
            $name = $value = $whole = '';
            return false;
        }

        $whole = str_replace( $value, $new_value, $whole );
        $value = $new_value;
    }

    if ( is_array( $allowed_attr[$name_low] ) ) {
        // there are some checks
        foreach ( $allowed_attr[$name_low] as $currkey => $currval ) {
            if ( ! gp_kses_check_attr_val( $value, $vless, $currkey, $currval ) ) {
                $name = $value = $whole = '';
                return false;
            }
        }
    }

    return true;
}

/**
 * Inline CSS filter
 *
 * @since 2.8.1
 */
function gp_safecss_filter_attr( $css) {

    $css = gp_kses_no_null($css);
    $css = str_replace(array("\n","\r","\t"), '', $css);

    if ( preg_match( '%[\\\\(&=}]|/\*%', $css ) ) // remove any inline css containing \ ( & } = or comments
        return '';

    $css_array = explode( ';', trim( $css ) );

    $allowed_attr = array( 'text-align', 'margin', 'color', 'float',
        'border', 'background', 'background-color', 'border-bottom', 'border-bottom-color',
        'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-left',
        'border-left-color', 'border-left-style', 'border-left-width', 'border-right', 'border-right-color',
        'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top',
        'border-top-color', 'border-top-style', 'border-top-width', 'border-width', 'caption-side',
        'clear', 'cursor', 'direction', 'font', 'font-family', 'font-size', 'font-style',
        'font-variant', 'font-weight', 'height', 'letter-spacing', 'line-height', 'margin-bottom',
        'margin-left', 'margin-right', 'margin-top', 'overflow', 'padding', 'padding-bottom',
        'padding-left', 'padding-right', 'padding-top', 'text-decoration', 'text-indent', 'vertical-align',
        'width' );

    if ( empty($allowed_attr) )
        return $css;

    $css = '';
    foreach ( $css_array as $css_item ) {
        if ( $css_item == '' )
            continue;
        $css_item = trim( $css_item );
        $found = false;
        if ( strpos( $css_item, ':' ) === false ) {
            $found = true;
        } else {
            $parts = explode( ':', $css_item );
            if ( in_array( trim( $parts[0] ), $allowed_attr ) )
                $found = true;
        }
        if ( $found ) {
            if( $css != '' )
                $css .= ';';
            $css .= $css_item;
        }
    }

    return $css;
}

/**
 * Performs different checks for attribute values.
 *
 * The currently implemented checks are "maxlen", "minlen", "maxval", "minval"
 * and "valueless".
 *
 * @since 1.0.0
 *
 * @param string $value Attribute value
 * @param string $vless Whether the value is valueless. Use 'y' or 'n'
 * @param string $checkname What $checkvalue is checking for.
 * @param mixed $checkvalue What constraint the value should pass
 * @return bool Whether check passes
 */
function gp_kses_check_attr_val($value, $vless, $checkname, $checkvalue) {
    $ok = true;

    switch (strtolower($checkname)) {
        case 'maxlen' :
            // The maxlen check makes sure that the attribute value has a length not
            // greater than the given value. This can be used to avoid Buffer Overflows
            // in WWW clients and various Internet servers.

            if (strlen($value) > $checkvalue)
                $ok = false;
            break;

        case 'minlen' :
            // The minlen check makes sure that the attribute value has a length not
            // smaller than the given value.

            if (strlen($value) < $checkvalue)
                $ok = false;
            break;

        case 'maxval' :
            // The maxval check does two things: it checks that the attribute value is
            // an integer from 0 and up, without an excessive amount of zeroes or
            // whitespace (to avoid Buffer Overflows). It also checks that the attribute
            // value is not greater than the given value.
            // This check can be used to avoid Denial of Service attacks.

            if (!preg_match('/^\s{0,6}[0-9]{1,6}\s{0,6}$/', $value))
                $ok = false;
            if ($value > $checkvalue)
                $ok = false;
            break;

        case 'minval' :
            // The minval check makes sure that the attribute value is a positive integer,
            // and that it is not smaller than the given value.

            if (!preg_match('/^\s{0,6}[0-9]{1,6}\s{0,6}$/', $value))
                $ok = false;
            if ($value < $checkvalue)
                $ok = false;
            break;

        case 'valueless' :
            // The valueless check makes sure if the attribute has a value
            // (like <a href="blah">) or not (<option selected>). If the given value
            // is a "y" or a "Y", the attribute must not have a value.
            // If the given value is an "n" or an "N", the attribute must have one.

            if (strtolower($checkvalue) != $vless)
                $ok = false;
            break;
    } // switch

    return $ok;
}
