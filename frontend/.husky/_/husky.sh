#!/usr/bin/env sh

# Husky v9 기본 설정
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$_" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $1 hook exited with code $exitCode (error)"
  fi

  if [ $exitCode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi