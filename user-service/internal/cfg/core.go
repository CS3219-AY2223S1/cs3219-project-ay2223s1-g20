package cfg

type DeploymentEnvironment int

const (
	DEV DeploymentEnvironment = iota
	STAG
	PROD
)

func ToEnv(env string) DeploymentEnvironment {
	switch env {
	case "DEV":
		return DEV
	case "STAG":
		return STAG
	case "PROD":
		return PROD
	default:
		return DEV
	}
}
