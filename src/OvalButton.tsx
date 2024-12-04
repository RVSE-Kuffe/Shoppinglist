import React from "react";
import "./ovalbutton.less";

/**
 * Ovális gomb komponens, amely egy ikont és szöveget tartalmaz.
 * @param text A gomb szövege.
 * @param onClick A gombra kattintás eseménykezelője (opcionális).
 */
export function OvalButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    // Gomb HTML elem ovális stílussal
    <button className="oval-button" onClick={onClick}>
      {/* Plusz ikon a szöveg előtt */}
      <span className="icon">+</span>
      {/* Gomb szövege */}
      <span className="text">{text}</span>
    </button>
  );
}
