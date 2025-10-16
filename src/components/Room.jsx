export default function Room({
  room: { opened, openable, walkable, current, floorplan } = {},
  onClick = () => { },
}) {
  const isEnterable = openable || walkable;

  // Background
  const bgColor = opened && floorplan?.color ? floorplan.color : "transparent";

  // Name
  const name = opened && floorplan?.name ? floorplan.name : "";

  // Doors
  const doors = floorplan?.doors || {};

  // Border logic
  let borderClass = "";
  if (current) borderClass = "border-4 border-blue-400";
  else if (opened) borderClass = "border-4 border-gray-300";
  else if (isEnterable) borderClass = "border-gray-300 hover:border-4";

  // Hover effect only for enterable
  const hoverEffect = isEnterable
    ? "hover:brightness-110 cursor-pointer"
    : "";

  const doorStyle = "absolute bg-gray-800";

  // If not opened and not enterable, render empty space
  if (!opened && !isEnterable) {
    return <div className="w-12 aspect-square" />;
  }

  return (
    <div
      className={`relative w-12 aspect-square shadow-sm rounded-sx flex
        items-center justify-center text-xs font-semibold
        text-shadow-black text-shadow-md ${borderClass} ${hoverEffect}`}
      style={{ backgroundColor: bgColor }}
      onClick={() => {
        if (isEnterable) onClick();
      }}
    >
      {name}

      {/* Doors */}
      {opened && doors.north && (
        <div
          className={doorStyle}
          style={{ top: "-4px", left: "25%", width: "50%", height: "4px" }}
        />
      )}
      {opened && doors.south && (
        <div
          className={doorStyle}
          style={{ bottom: "-4px", left: "25%", width: "50%", height: "4px" }}
        />
      )}
      {opened && doors.west && (
        <div
          className={doorStyle}
          style={{ top: "25%", left: "-4px", width: "4px", height: "50%" }}
        />
      )}
      {opened && doors.east && (
        <div
          className={doorStyle}
          style={{ top: "25%", right: "-4px", width: "4px", height: "50%" }}
        />
      )}
    </div>
  );
}
