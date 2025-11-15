{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python311
    python311Packages.google-generativeai
    gnumake
  ];

  shellHook = ''
    make setup
    if [[ -d venv ]]; then
    source venv/bin/activate
    fi
  '';
}
