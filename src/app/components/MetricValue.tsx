import { AnimatedNumber } from "./AnimatedNumber";

function splitValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { number: value, suffix: "" };
  return { number: match[1], suffix: match[2] };
}

export function MetricValue({
  value,
  suffixClassName = "text-base font-normal text-gray-400 ml-0.5",
}: {
  value: string;
  suffixClassName?: string;
}) {
  const { number, suffix } = splitValue(value);

  if (!suffix) return <AnimatedNumber value={value} />;

  return (
    <>
      <AnimatedNumber value={number} />
      <span className={suffixClassName}>{suffix}</span>
    </>
  );
}
