export const PrimaryButton = {
  None: 0,
  Magnet: 1,
  Touch: 2,
  IndirectTouch: 3,
} as const;

export const VerticalAlignment = {
  Bottom: 0,
  Center: 1,
  Top: 2,
} as const;

type ValueOf<T> = T[keyof T];

export interface CardboardParams {
  vendor: string;
  model: string;
  primary_button: ValueOf<typeof PrimaryButton>;
  has_magnet: boolean;
  vertical_alignment: ValueOf<typeof VerticalAlignment>;
  inter_lens_distance: number;
  screen_to_lens_distance: number;
  tray_to_lens_distance: number;
  distortion_coefficients: [number, number];
  left_eye_field_of_view_angles: [number, number, number, number];
}

export const getDefaultParams = (): CardboardParams => {
  return {
    vendor: "Custom vendor",
    model: "Custom model",
    primary_button: PrimaryButton.None,
    has_magnet: false,
    vertical_alignment: VerticalAlignment.Bottom,
    inter_lens_distance: 60, // need to divide 1000
    screen_to_lens_distance: 42, // need to divide 1000
    tray_to_lens_distance: 35, // need to divide 1000
    distortion_coefficients: [0.25, 0.25],
    left_eye_field_of_view_angles: [50, 50, 50, 50],
  };
};
