package dto

type ChangeUserProfileDto struct {
	LastName     *string `json:"last_name"`
	FirstName    *string `json:"first_name"`
	BirthdayDate *string `json:"birthday_date"`
	PhoneNumber  *string `json:"phone_number"`
	Email        *string `json:"email"`
}

type CreateUserDto struct {
	PhoneNumber      string `json:"phone_number"`
	VerificationCode string `json:"verification_code"`
}

type ChangeUserNotificationSettingsDto struct {
	BySms   *bool `json:"by_sms"`
	ByEmail *bool `json:"by_email"`
}
