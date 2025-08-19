import React from 'react';
import { Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

export const DeploymentBanner: React.FunctionComponent = () => {
  const buildTimestamp = __BUILD_TIMESTAMP__;
  const [isVisible, setIsVisible] = React.useState(() => {
    // Check sessionStorage to see if banner was dismissed this session
    return sessionStorage.getItem('deploymentBannerDismissed') !== 'true';
  });
  
  // Format the timestamp for display
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('deploymentBannerDismissed', 'true');
  };

  // Don't render if dismissed
  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '0.75rem',
      color: '#6a6e73',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 1000,
      maxWidth: '300px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <span title={`Build: ${formatTimestamp(buildTimestamp)}`}>
        Updated {formatTimestamp(buildTimestamp).split(',')[0]}
      </span>
      <Button
        variant="plain"
        onClick={handleDismiss}
        aria-label="Dismiss build info"
        style={{ 
          padding: '2px',
          minWidth: 'auto',
          height: 'auto',
          color: '#6a6e73'
        }}
      >
        <TimesIcon style={{ fontSize: '0.75rem' }} />
      </Button>
    </div>
  );
};