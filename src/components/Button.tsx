import type { IButtonProps } from "../types/controls";

export default function Button({ text, onClick }: IButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {text}
    </button>
  );
}
