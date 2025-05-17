import React from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useTheme
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { getPlatformIcon } from '../utils/platformIcons';

// 平台列表
const PLATFORM_LIST = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'line', name: 'LINE', color: '#00B900' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
  { id: 'messenger', name: 'Messenger', color: '#0084FF' },
  { id: 'telegram', name: 'Telegram', color: '#0088CC' },
  { id: 'twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'discord', name: 'Discord', color: '#5865F2' },
  { id: 'skype', name: 'Skype', color: '#00AFF0' },
  { id: 'wechat', name: 'WeChat', color: '#07C160' }
];

interface PlatformSelectorProps {
  onSelect?: (platformId: string) => void;
  showSelectedOnly?: boolean;
  compact?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  onSelect,
  showSelectedOnly = false,
  compact = false
}) => {
  const theme = useTheme();
  const { authorizedPlatforms, setAuthorizedPlatforms } = useAppContext();
  
  const handleTogglePlatform = (platformId: string) => {
    if (authorizedPlatforms.includes(platformId)) {
      setAuthorizedPlatforms(authorizedPlatforms.filter(id => id !== platformId));
    } else {
      setAuthorizedPlatforms([...authorizedPlatforms, platformId]);
    }
    
    if (onSelect) {
      onSelect(platformId);
    }
  };
  
  const filteredPlatforms = showSelectedOnly 
    ? PLATFORM_LIST.filter(platform => authorizedPlatforms.includes(platform.id))
    : PLATFORM_LIST;
  
  if (compact) {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {filteredPlatforms.map((platform) => {
          const isSelected = authorizedPlatforms.includes(platform.id);
          return (
            <Chip
              key={platform.id}
              avatar={
                <Avatar sx={{ bgcolor: 'transparent', color: platform.color }}>
                  {getPlatformIcon(platform.id, { fontSize: 'small' })}
                </Avatar>
              }
              label={platform.name}
              onClick={() => handleTogglePlatform(platform.id)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{ 
                borderRadius: 4,
                transition: 'all 0.2s'
              }}
            />
          );
        })}
      </Box>
    );
  }
  
  return (
    <Box>
      <List sx={{ width: '100%' }}>
        {filteredPlatforms.map((platform, index) => {
          const isSelected = authorizedPlatforms.includes(platform.id);
          return (
            <React.Fragment key={platform.id}>
              <ListItem
                onClick={() => handleTogglePlatform(platform.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: isSelected ? `${platform.color}20` : 'transparent',
                  '&:hover': {
                    bgcolor: isSelected ? `${platform.color}30` : 'action.hover'
                  },
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{ 
                    color: isSelected ? platform.color : 'text.secondary',
                    transition: 'color 0.3s'
                  }}>
                    {getPlatformIcon(platform.id)}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={platform.name} 
                  sx={{ 
                    color: isSelected ? 'text.primary' : 'text.secondary',
                    transition: 'color 0.3s',
                    '& .MuiListItemText-primary': {
                      fontWeight: isSelected ? 500 : 400,
                    }
                  }}
                />
                {isSelected && (
                  <Badge
                    color="success"
                    variant="dot"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
              {index < filteredPlatforms.length - 1 && <Divider variant="fullWidth" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default PlatformSelector; 