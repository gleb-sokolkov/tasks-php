<?php
  $postData = file_get_contents('php://input');
  $data = json_decode($postData, true);

  $keys = preg_match_all('/(?<=")[a-z0-9 ]+[^"](?=")|\w+/im', $data['search'], $matches);
  if(empty($matches[0])) {
    echo $data['text'];
  } else {
    $words = array_map(fn($t) => "\b".$t."\b", $matches[0]);
    $match = "/".implode('|', $words)."/im";
    $text = preg_replace($match, '<mark>$0</mark>', $data['text']);
    echo $text;
  }
?>