import { useRef, useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui';
import { cn } from '../../ui/utils';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
}

export function TruncatedText({ 
  text, 
  maxLength = 50, 
  className,
  showTooltip = true 
}: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth || text.length > maxLength);
    }
  }, [text, maxLength]);

  const displayText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const content = (
    <span
      ref={textRef}
      className={cn('truncate', className)}
      title={isTruncated && !showTooltip ? text : undefined}
    >
      {displayText}
    </span>
  );

  if (!showTooltip || !isTruncated) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

