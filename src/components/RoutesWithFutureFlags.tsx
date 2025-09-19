import React from 'react';
import { Routes as ReactRouterRoutes, RoutesProps } from 'react-router-dom';

// Extended RoutesProps to include future flags
interface ExtendedRoutesProps extends RoutesProps {
  future?: {
    v7_startTransition?: boolean;
    v7_relativeSplatPath?: boolean;
  };
}

// Custom Routes component that applies future flags to suppress warnings
export const Routes: React.FC<ExtendedRoutesProps> = ({ children, ...props }) => {
  return (
    <ReactRouterRoutes 
      {...props}
      {...({ 
        future: { 
          v7_startTransition: true, 
          v7_relativeSplatPath: true 
        }
      } as any)}
    >
      {children}
    </ReactRouterRoutes>
  );
};
