# Side-by-Side Review

A new navigation tab that provides a side-by-side interface for searching and reviewing image configurations.

## Features

### Left Panel - Search Form
- **Search query**: Full-text search across image names and descriptions
- **Filter options**: Filter by all images, name, release, environment, or recently built
- **Release version**: Filter by specific RHEL/CentOS releases
- **Target environment**: Filter by cloud providers and deployment targets
- **Search button**: Executes the search with loading states

### Right Panel - Review Results
- **Dynamic results**: Updates based on search criteria from the left panel
- **Detailed information**: Shows comprehensive image configuration details
- **Multiple results**: Displays all matching images in a scrollable list
- **Timestamps**: Shows when each image was built

## Usage

1. Navigate to the "Side-by-Side Review" tab in the main navigation
2. Use the search form on the left to:
   - Enter search terms in the query field
   - Select filters to narrow down results
   - Choose specific release versions or target environments
3. Click "Search Images" to execute the search
4. Review the results on the right panel
5. Compare multiple image configurations side-by-side

## Technical Implementation

- Built with PatternFly React components for consistent UI/UX
- Uses React hooks for state management
- Implements proper loading states and error handling
- Responsive grid layout for optimal viewing
- Mock data for demonstration purposes

## Future Enhancements

- Real API integration for live data
- Advanced filtering and sorting options
- Export functionality for search results
- Detailed comparison view between images
- Search history and saved searches 