import { Avatar, AvatarFallback, AvatarImage, Button } from '../../ui';
import { cn } from '../../ui/utils';

interface UserProfileProps {
  name: string;
  role?: string;
  avatar?: string;
  initials?: string;
  onViewProfile?: () => void;
  className?: string;
  variant?: 'default' | 'gradient';
}

/**
 * UserProfile Component
 * 
 * User profile card for sidebar footer
 * 
 * @example
 * <UserProfile
 *   name="ABC Services"
 *   role="Premium Contractor"
 *   initials="AB"
 *   onViewProfile={() => console.log('View profile')}
 *   variant="gradient"
 * />
 */
export function UserProfile({
  name,
  role,
  avatar,
  initials,
  onViewProfile,
  className,
  variant = 'gradient',
}: UserProfileProps) {
  const displayInitials =
    initials || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div
      className={cn(
        'p-4 rounded-xl',
        variant === 'gradient'
          ? 'bg-gradient-to-br from-gold-400 to-gold-500'
          : 'bg-gray-50 border border-border',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback
              className={
                variant === 'gradient'
                  ? 'bg-white/20 backdrop-blur-sm text-black font-bold'
                  : 'bg-gray-200 text-gray-700 font-semibold'
              }
            >
              {displayInitials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'font-semibold text-sm truncate',
              variant === 'gradient' ? 'text-black' : 'text-gray-900'
            )}
          >
            {name}
          </p>
          {role && (
            <p
              className={cn(
                'text-xs truncate',
                variant === 'gradient' ? 'text-black/70' : 'text-gray-500'
              )}
            >
              {role}
            </p>
          )}
        </div>
      </div>
      {onViewProfile && (
        <Button
          onClick={onViewProfile}
          variant={variant === 'gradient' ? 'secondary' : 'outline'}
          className="w-full text-sm"
        >
          View Profile
        </Button>
      )}
    </div>
  );
}

