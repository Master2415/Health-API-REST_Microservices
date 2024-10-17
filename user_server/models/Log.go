package models

type Log struct {
	ID          int    `json:"id" gorm:"primaryKey, autoIncrement"`
	AppName     string `json:"app_name"`                          
	LogType     string `json:"log_type"`                     
	Module      string `json:"module"`                            
	LogDateTime string `json:"log_date_time"`                  
	Summary     string `json:"summary"`                         
	Description string `json:"description"`                        
}
