[
  {
    "table_schema": "public",
    "table_name": "contestants",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('contestants_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "age",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "hometown",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "residence",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "occupation",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 7
      },
      {
        "column_name": "current_tribe_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 10
      },
      {
        "column_name": "is_eliminated",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 11
      },
      {
        "column_name": "elimination_episode_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 12
      },
      {
        "column_name": "image_url",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 13
      },
      {
        "column_name": "points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 14
      },
      {
        "column_name": "episodes",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "1",
        "ordinal_position": 15
      },
      {
        "column_name": "final_placement",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 16
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 17
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 18
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "draft_picks",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('draft_picks_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "contestant_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "pick_number",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "assigned_from_rank",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "assigned_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 7
      },
      {
        "column_name": "is_active",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "true",
        "ordinal_position": 8
      },
      {
        "column_name": "replaced_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 9
      },
      {
        "column_name": "replaced_by_pick_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 10
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "draft_rankings",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('draft_rankings_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "contestant_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "rank_position",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "submitted_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "is_submitted",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 7
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 8
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 9
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "episode_scoring_events",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('episode_scoring_events_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "episode_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "contestant_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "scoring_event_type_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "points_awarded",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "notes",
        "data_type": "text",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 7
      },
      {
        "column_name": "created_by_user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 8
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "episodes",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('episodes_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "episode_number",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "air_date",
        "data_type": "date",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "is_finale",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 5
      },
      {
        "column_name": "is_scored",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 6
      },
      {
        "column_name": "scoring_locked",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 7
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 8
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 9
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "scoring_event_types",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('scoring_event_types_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "display_name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "points",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "category",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "icon",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "is_penalty",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 7
      },
      {
        "column_name": "is_active",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "true",
        "ordinal_position": 8
      },
      {
        "column_name": "scope",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": "'contestant'::character varying",
        "ordinal_position": 9
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "seasons",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('seasons_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "season_number",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "season_name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "start_date",
        "data_type": "date",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "end_date",
        "data_type": "date",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "draft_deadline",
        "data_type": "timestamp with time zone",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 6
      },
      {
        "column_name": "sole_survivor_deadline",
        "data_type": "timestamp with time zone",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 7
      },
      {
        "column_name": "episode_2_deadline",
        "data_type": "timestamp with time zone",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 8
      },
      {
        "column_name": "is_active",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "true",
        "ordinal_position": 9
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 10
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 11
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "sole_survivor_picks",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('sole_survivor_picks_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "contestant_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "selected_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 5
      },
      {
        "column_name": "episodes_held",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 6
      },
      {
        "column_name": "is_original_pick",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 7
      },
      {
        "column_name": "is_active",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "true",
        "ordinal_position": 8
      },
      {
        "column_name": "replaced_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 9
      },
      {
        "column_name": "replaced_by_pick_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 10
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "tribes",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('tribes_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "color",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "is_active",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "true",
        "ordinal_position": 5
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 6
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "user_actions",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('user_actions_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "action_type",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "details",
        "data_type": "jsonb",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 5
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "user_episode_scores",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('user_episode_scores_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "episode_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "draft_points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 5
      },
      {
        "column_name": "sole_survivor_points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 6
      },
      {
        "column_name": "elimination_bonus_points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 7
      },
      {
        "column_name": "total_points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 8
      },
      {
        "column_name": "calculated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 9
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "user_profiles",
    "columns": [
      {
        "column_name": "id",
        "data_type": "uuid",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 1
      },
      {
        "column_name": "email",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "username",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "first_name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 4
      },
      {
        "column_name": "last_name",
        "data_type": "character varying",
        "is_nullable": "NO",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "is_admin",
        "data_type": "boolean",
        "is_nullable": "YES",
        "column_default": "false",
        "ordinal_position": 6
      },
      {
        "column_name": "avatar_url",
        "data_type": "character varying",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 7
      },
      {
        "column_name": "created_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 8
      },
      {
        "column_name": "updated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 9
      },
      {
        "column_name": "last_login_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 10
      }
    ]
  },
  {
    "table_schema": "public",
    "table_name": "user_season_scores",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO",
        "column_default": "nextval('user_season_scores_id_seq'::regclass)",
        "ordinal_position": 1
      },
      {
        "column_name": "user_id",
        "data_type": "uuid",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 2
      },
      {
        "column_name": "season_id",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 3
      },
      {
        "column_name": "total_points",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 4
      },
      {
        "column_name": "current_rank",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": null,
        "ordinal_position": 5
      },
      {
        "column_name": "episodes_scored",
        "data_type": "integer",
        "is_nullable": "YES",
        "column_default": "0",
        "ordinal_position": 6
      },
      {
        "column_name": "last_calculated_at",
        "data_type": "timestamp with time zone",
        "is_nullable": "YES",
        "column_default": "now()",
        "ordinal_position": 7
      }
    ]
  }
]