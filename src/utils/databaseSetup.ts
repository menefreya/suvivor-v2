import { supabase } from '../supabase'

export class DatabaseSetup {
  /**
   * Set up a complete season with contestants for testing
   */
  static async setupTestSeason() {
    try {
      console.log('Setting up test season...')
      
      // First, check if there's already an active season
      const { data: existingSeasons, error: checkError } = await supabase
        .from('seasons')
        .select('*')
        .eq('is_active', true)

      if (checkError) {
        console.error('Error checking existing seasons:', checkError)
        return
      }

      if (existingSeasons && existingSeasons.length > 0) {
        console.log('Active season already exists:', existingSeasons[0])
        console.log('To create a new season, first deactivate the current one:')
        console.log('window.databaseSetup.deactivateCurrentSeason()')
        return existingSeasons[0]
      }

      // Create a new season with future deadline
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30) // 30 days from now
      
      const { data: season, error: seasonError } = await supabase
        .from('seasons')
        .insert({
          season_number: 1,
          season_name: 'Survivor Season 2024',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          draft_deadline: futureDate.toISOString(),
          sole_survivor_deadline: futureDate.toISOString(),
          episode_2_deadline: futureDate.toISOString(),
          is_active: true
        })
        .select()
        .single()

      if (seasonError) {
        console.error('Error creating season:', seasonError)
        return
      }

      console.log('Created season:', season)

      // Add contestants
      const contestants = [
        { name: 'Alice Johnson', age: 28, occupation: 'Teacher', hometown: 'New York, NY', residence: 'Brooklyn, NY' },
        { name: 'Bob Smith', age: 35, occupation: 'Engineer', hometown: 'Los Angeles, CA', residence: 'Hollywood, CA' },
        { name: 'Carol Davis', age: 42, occupation: 'Nurse', hometown: 'Chicago, IL', residence: 'Downtown Chicago, IL' },
        { name: 'David Wilson', age: 31, occupation: 'Chef', hometown: 'Miami, FL', residence: 'South Beach, FL' },
        { name: 'Eva Martinez', age: 26, occupation: 'Artist', hometown: 'Austin, TX', residence: 'East Side, Austin, TX' },
        { name: 'Frank Brown', age: 38, occupation: 'Lawyer', hometown: 'Seattle, WA', residence: 'Capitol Hill, Seattle, WA' },
        { name: 'Grace Lee', age: 29, occupation: 'Doctor', hometown: 'Boston, MA', residence: 'Back Bay, Boston, MA' },
        { name: 'Henry Taylor', age: 33, occupation: 'Photographer', hometown: 'Denver, CO', residence: 'LoDo, Denver, CO' },
        { name: 'Ivy Chen', age: 24, occupation: 'Student', hometown: 'San Francisco, CA', residence: 'Mission District, SF, CA' },
        { name: 'Jack Rodriguez', age: 41, occupation: 'Firefighter', hometown: 'Phoenix, AZ', residence: 'Downtown Phoenix, AZ' }
      ]

      const contestantsData = contestants.map(contestant => ({
        season_id: season.id,
        name: contestant.name,
        age: contestant.age,
        occupation: contestant.occupation,
        hometown: contestant.hometown,
        residence: contestant.residence,
        is_eliminated: false,
        points: 0,
        episodes: 1
      }))

      const { data: insertedContestants, error: contestantsError } = await supabase
        .from('contestants')
        .insert(contestantsData)
        .select()

      if (contestantsError) {
        console.error('Error adding contestants:', contestantsError)
        return
      }

      console.log('Added contestants:', insertedContestants)
      console.log('✅ Test season setup complete!')
      console.log('You can now navigate to /drafts to test the draft functionality.')
      
      return { season, contestants: insertedContestants }
    } catch (error) {
      console.error('Error setting up test season:', error)
    }
  }

  /**
   * Deactivate the current active season
   */
  static async deactivateCurrentSeason() {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .update({ is_active: false })
        .eq('is_active', true)
        .select()

      if (error) {
        console.error('Error deactivating season:', error)
        return
      }

      console.log('Deactivated seasons:', data)
      return data
    } catch (error) {
      console.error('Error deactivating season:', error)
    }
  }

  /**
   * Extend the deadline for the current season
   */
  static async extendDeadline(daysFromNow: number = 30) {
    try {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + daysFromNow)
      
      const { data, error } = await supabase
        .from('seasons')
        .update({
          episode_2_deadline: futureDate.toISOString(),
          draft_deadline: futureDate.toISOString(),
          sole_survivor_deadline: futureDate.toISOString()
        })
        .eq('is_active', true)
        .select()

      if (error) {
        console.error('Error extending deadline:', error)
        return
      }

      console.log('Extended deadline to:', futureDate.toISOString())
      console.log('Updated seasons:', data)
      return data
    } catch (error) {
      console.error('Error extending deadline:', error)
    }
  }

  /**
   * Check the current database state
   */
  static async checkState() {
    try {
      console.log('=== DATABASE STATE CHECK ===')
      
      // Check seasons
      const { data: seasons, error: seasonsError } = await supabase
        .from('seasons')
        .select('*')
        .order('season_number', { ascending: false })

      if (seasonsError) {
        console.error('Error fetching seasons:', seasonsError)
      } else {
        console.log('All seasons:', seasons)
        const activeSeason = seasons?.find(s => s.is_active)
        console.log('Active season:', activeSeason)
        
        if (activeSeason) {
          const deadline = new Date(activeSeason.episode_2_deadline)
          const now = new Date()
          const isExpired = now > deadline
          console.log('Deadline check:', {
            deadline: deadline.toISOString(),
            now: now.toISOString(),
            isExpired,
            daysUntilDeadline: Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          })
        }
      }

      // Check contestants for active season
      if (seasons?.find(s => s.is_active)) {
        const activeSeason = seasons.find(s => s.is_active)
        const { data: contestants, error: contestantsError } = await supabase
          .from('contestants')
          .select('*')
          .eq('season_id', activeSeason.id)
          .order('name')

        if (contestantsError) {
          console.error('Error fetching contestants:', contestantsError)
        } else {
          console.log(`Contestants for active season (${activeSeason.season_name}):`, contestants)
        }
      }

      console.log('=== END DATABASE STATE CHECK ===')
    } catch (error) {
      console.error('Error checking database state:', error)
    }
  }
}

// Console helpers for development
if (typeof window !== 'undefined') {
  (window as any).databaseSetup = DatabaseSetup
  console.log('Database setup utilities available at window.databaseSetup')
  console.log('Usage examples:')
  console.log('  window.databaseSetup.checkState() - Check current DB state')
  console.log('  window.databaseSetup.setupTestSeason() - Create test season with contestants')
  console.log('  window.databaseSetup.extendDeadline(30) - Extend deadline by 30 days')
  console.log('  window.databaseSetup.deactivateCurrentSeason() - Deactivate current season')
}
