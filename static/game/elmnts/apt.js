function getApt() {
  return {
    "gridCols": 32,
    "gridRows": 20,
    "girlfriend_start_pos": {
      "x": 7,
      "y": 16
    },
    "clown_start_pos": {
      "x": 1,
      "y": 3
    },
    "rooms": [
      {
        "name": "Kitchen",
        "label_position": {
          "x": 28,
          "y": 3
        },
        "start_col": 26,
        "end_col": 30,
        "start_row": 1,
        "end_row": 5,
        "hiding_places": []
      },
      {
        "name": "Storage",
        "label_position": {
          "x": 3,
          "y": 3
        },
        "start_col": 1,
        "end_col": 5,
        "start_row": 1,
        "end_row": 5,
        "hiding_places": [
          {
            "name": "closet",
            "hiding_type": "in",
            "position": {
              "x": 1,
              "y": 2
            }
          }
        ]
      },
      {
        "name": "My Bedroom",
        "label_position": {
          "x": 7,
          "y": 14
        },
        "start_col": 1,
        "end_col": 8,
        "start_row": 13,
        "end_row": 18,
        "hiding_places": [
          {
            "name": "bed",
            "hiding_type": "under",
            "position": {
              "x": 4,
              "y": 14
            }
          }
        ]
      },
      {
        "name": "Bathroom",
        "label_position": {
          "x": 16,
          "y": 10
        },
        "start_col": 15,
        "end_col": 17,
        "start_row": 7,
        "end_row": 12,
        "hiding_places": [
          {
            "name": "bathtub",
            "hiding_type": "in",
            "position": {
              "x": 15,
              "y": 7
            }
          }
        ]
      },
      {
        "name": "Main Hallway",
        "label_position": {
          "x": 14,
          "y": 15
        },
        "start_col": 10,
        "end_col": 17,
        "start_row": 13,
        "end_row": 18,
        "hiding_places": []
      },
      {
        "name": "Living Room",
        "label_position": {
          "x": 21,
          "y": 15
        },
        "start_col": 19,
        "end_col": 24,
        "start_row": 13,
        "end_row": 18,
        "hiding_places": []
      },
      {
        "name": "Guest Bedroom",
        "label_position": {
          "x": 28,
          "y": 15
        },
        "start_col": 26,
        "end_col": 30,
        "start_row": 13,
        "end_row": 18,
        "hiding_places": [
          {
            "name": "bed",
            "hiding_type": "under",
            "position": {
              "x": 28,
              "y": 18
            }
          }
        ]
      },
      {
        "name": "Dining Room",
        "label_position": {
          "x": 16,
          "y": 3
        },
        "start_col": 14,
        "end_col": 24,
        "start_row": 1,
        "end_row": 5,
        "hiding_places": [
          {
            "name": "table",
            "hiding_type": "under",
            "position": {
              "x": 20,
              "y": 3
            }
          }
        ]
      },
      {
        "name": "Office",
        "label_position": {
          "x": 21,
          "y": 9
        },
        "start_col": 19,
        "end_col": 24,
        "start_row": 7,
        "end_row": 11,
        "hiding_places": []
      },
      {
        "name": "North Hallway",
        "label_position": {
          "x": 9,
          "y": 3
        },
        "start_col": 7,
        "end_col": 12,
        "start_row": 3,
        "end_row": 3,
        "hiding_places": []
      }
    ]
  }
}